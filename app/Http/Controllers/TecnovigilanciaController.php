<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Categoria;
use App\Mail\AnalisisRealizado;
use App\Models\Archivo;
use App\Models\EventoAdverso;
use App\Models\Revision;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TecnovigilanciaController extends Controller
{
    private const CATEGORIA = 'Tecnovigilancia';

    // Catálogo de causas probables (debe coincidir con CAUSAS_PROBABLES en ModalAnalisisTecnovigilancia.jsx)
    private const CAUSAS_PROBABLES = [
        'Uso anormal',
        'Respuesta fisiológica anormal o inexplicable',
        'Falla en la alarma',
        'Uso de material biológico',
        'Calibración',
        'Hardware de computador',
        'Contaminación durante la producción',
        'Contaminación post-producción',
        'Diseño',
        'Desconexión',
        'Componente eléctrico',
        'Circuito eléctrico',
        'Contacto eléctrico',
        'Interferencia Electromagnética EIM',
        'Fecha de expiración',
        'Falso Negativo',
        'Falso positivo',
        'Resultado falso de la prueba',
        'Ambiente inapropiado',
        'Incompatibilidad',
        'Instrucciones para uso y rotulado',
        'Escape/ sellado',
        'Mantenimiento',
        'Fabricación',
        'Material',
        'Componentes Mecánicos',
        'Condiciones no higiénicas',
        'No relacionado con el dispositivo',
        'Otros',
        'Empaque',
        'Anatomía/ Fisiología del paciente',
        'Condiciones del paciente',
        'Fuente de energía',
        'Medida de protección',
        'Aseguramiento de la calidad en la institución para la atención de salud',
        'Radiación',
        'Software',
        'Esterilización/desinfección/ limpieza',
        'Condiciones de almacenamiento',
        'Manipulación, falsificación, sabotaje',
        'Entrenamiento',
        'Transporte y entrega',
        'Sin definir',
        'Error de Uso',
        'Desgaste',
    ];

    // ── Consulta base: solo eventos de la categoría Tecnovigilancia en proceso ──
    private function consulta()
    {
        return EventoAdverso::with(['categoria', 'area', 'reportante', 'paciente', 'tecnovigilancia'])
            ->whereHas('categoria', fn($q) => $q->where('nombre', self::CATEGORIA))
            ->where('estado', 'en_proceso')
            ->orderBy('created_at', 'desc');
    }

    // ── Lista de eventos de tecnovigilancia ──
    public function index()
    {
        return Inertia::render('Tecnovigilancia/Index', [
            'eventos'    => $this->consulta()->paginate(10),
            'categorias' => Categoria::where('activo', 1)->get(),
            'jefes'      => User::role('jefe')->get(['id', 'name']),
            'areas'      => Area::where('activo', 1)->get(['id_area', 'nombre']),
        ]);
    }

    // ── Guardar análisis de tecnovigilancia ──
    // Igual que Calidad: el evento pasa a 'analizado', se asigna al jefe y se le avisa por correo.
    public function guardarAnalisis(Request $request, EventoAdverso $evento)
    {
        abort_if($evento->categoria?->nombre !== self::CATEGORIA, 403, 'Solo eventos de Tecnovigilancia.');

        $tecno = $evento->tecnovigilancia;
        abort_if(!$tecno, 422, 'El evento no tiene datos de tecnovigilancia registrados.');

        $datos = $request->validate([
            'causa_probable'           => 'required|array|min:1',
            'causa_probable.*'         => ['string', Rule::in(self::CAUSAS_PROBABLES)],
            'acciones_correctivas'     => 'required|string',
            'reportado_fabricante'     => 'required|boolean',
            'fecha_reporte_fabricante' => 'nullable|required_if:reportado_fabricante,1|date|before_or_equal:today',
            'dm_disponible_evaluacion' => 'required|boolean',
            'dm_enviado_fabricante'    => 'required|boolean',
            'descripcion_analisis'     => 'required|string',
            'fk_jefe'                  => 'required|exists:users,id',
            'archivos.*'               => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        if (!$datos['reportado_fabricante']) {
            $datos['fecha_reporte_fabricante'] = null;
        }

        $tecno->update(collect($datos)->except(['descripcion_analisis', 'fk_jefe', 'archivos'])->all());

        $evento->update([
            'descripcion_analisis' => $datos['descripcion_analisis'],
            'fk_jefe'              => $datos['fk_jefe'],
            'estado'               => 'analizado',
            'fk_usuario_calidad'   => Auth::id(),
            'fecha_analisis'       => now(),
        ]);

        // Guardar evidencia
        if ($request->hasFile('archivos')) {
            foreach ($request->file('archivos') as $file) {
                Archivo::create([
                    'fk_evento'  => $evento->id_eventoAdverso,
                    'fk_usuario' => Auth::id(),
                    'tipo'       => 'calidad',
                    'nombre'     => $file->getClientOriginalName(),
                    'ruta'       => $file->store('eventos/calidad', 'public'),
                    'extension'  => $file->getClientOriginalExtension(),
                ]);
            }
        }

        Revision::create([
            'fk_evento'   => $evento->id_eventoAdverso,
            'fk_usuario'  => Auth::id(),
            'tipo'        => 'Análisis de Tecnovigilancia',
            'observacion' => 'Se realizó el análisis de tecnovigilancia del evento N° ' . $evento->id_eventoAdverso . ' y se asignó al jefe ID ' . $datos['fk_jefe'] .
                '. Causa probable: ' . implode(', ', $datos['causa_probable']) .
                '. Fecha: ' . now()->format('Y-m-d') . ' a las ' . now()->format('H:i'),
        ]);

        // Avisar al jefe responsable (un fallo de correo no deshace el análisis)
        $evento->load(['categoria', 'area', 'jefe', 'tecnovigilancia']);
        if ($evento->jefe?->email) {
            try {
                Mail::to($evento->jefe->email)->send(new AnalisisRealizado($evento));
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return redirect()->back()->with('success', 'Análisis de tecnovigilancia guardado correctamente.');
    }

    // ── Exportar a Excel (el navegador genera el .xlsx) ──
    public function exportar()
    {
        $datos = $this->consulta()->get()->map(fn($e) => [
            'N° Evento'               => $e->id_eventoAdverso,
            'Fecha Evento'            => $e->fecha_evento?->format('Y-m-d'),
            'Fecha Creación'          => $e->created_at?->format('Y-m-d H:i'),
            'Área'                    => $e->area?->nombre,
            'Estado'                  => $e->estado,
            'Doc Reportante'          => $e->reportante?->cedula,
            'Nombres Reportante'      => trim($e->reportante?->nombres . ' ' . $e->reportante?->apellidos),
            'Cargo Reportante'        => $e->reportante?->cargo,
            'Doc Paciente'            => $e->paciente?->cedula,
            'Nombres Paciente'        => trim($e->paciente?->nombres . ' ' . $e->paciente?->apellidos),
            'Dispositivo'             => $e->tecnovigilancia?->nombre_dispositivo,
            'Marca'                   => $e->tecnovigilancia?->marca,
            'Modelo'                  => $e->tecnovigilancia?->modelo,
            'Serie'                   => $e->tecnovigilancia?->serie,
            'Área de funcionamiento'  => $e->tecnovigilancia?->area_funcionamiento_dm,
            'Uso más de una vez'      => is_null($e->tecnovigilancia) ? null : ($e->tecnovigilancia->uso_mas_de_una_vez ? 'Sí' : 'No'),
            'Detección del evento'    => $e->tecnovigilancia?->deteccion_evento,
            'Clasificación'           => $e->tecnovigilancia?->clasificacion,
            'Desenlace'               => $e->tecnovigilancia?->desenlace,
            'Diagnóstico inicial'     => $e->tecnovigilancia?->diagnostico_inicial,
            'Descripción'             => $e->descripcion,
            'Causa probable'          => implode(' | ', $e->tecnovigilancia?->causa_probable ?? []),
            'Acciones correctivas'    => $e->tecnovigilancia?->acciones_correctivas,
            'Reportó al fabricante'   => is_null($e->tecnovigilancia?->reportado_fabricante) ? null : ($e->tecnovigilancia->reportado_fabricante ? 'Sí' : 'No'),
            'Fecha reporte fabricante' => $e->tecnovigilancia?->fecha_reporte_fabricante?->format('d/m/Y'),
            'DM disponible para evaluación' => is_null($e->tecnovigilancia?->dm_disponible_evaluacion) ? null : ($e->tecnovigilancia->dm_disponible_evaluacion ? 'Sí' : 'No'),
            'DM enviado al fabricante' => is_null($e->tecnovigilancia?->dm_enviado_fabricante) ? null : ($e->tecnovigilancia->dm_enviado_fabricante ? 'Sí' : 'No'),
        ]);

        return response()->json($datos);
    }
}
