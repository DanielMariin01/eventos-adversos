<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: #5B6BB1;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            color: white;
            margin: 0;
            font-size: 22px;
        }

        .body {
            padding: 30px;
        }

        .badge {
            display: inline-block;
            background: #5B6BB1;
            border-radius: 12px;
            padding: 12px 30px;
            margin: 10px 0;
            text-align: center;
        }

        .badge-label {
            color: white;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 4px 0;
            display: block;
        }

        .badge-numero {
            color: white;
            font-size: 32px;
            font-weight: bold;
            margin: 0;
            display: block;
        }

        .info-row {
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .info-label {
            color: #6b7280;
            font-size: 14px;
            display: block;
        }

        .info-value {
            color: #111827;
            font-size: 14px;
            font-weight: bold;
        }

        .seccion {
            color: #00A09B;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 24px 0 4px 0;
        }

        .alerta {
            background: #E1EEFF;
            border-left: 4px solid #5B6BB1;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }

        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
        }
    </style>
</head>

<body>
    @php
        $tecno = $evento->tecnovigilancia;
        $esTecno = $evento->categoria?->nombre === 'Tecnovigilancia' && $tecno;
        $farma = $evento->farmacovigilancia;
        $esFarma = $evento->categoria?->nombre === 'Farmacovigilancia' && $farma;
        $siNo = fn($v) => is_null($v) ? '—' : ($v ? 'Sí' : 'No');
    @endphp
    <div class="container">
        <div class="header">
            <h1>Análisis de Evento Realizado</h1>
        </div>
        <div class="body">
            <p>Se realizó el análisis del siguiente evento adverso, del cual usted es el responsable:</p>
            <div style="text-align: center; margin: 20px 0;">
                <div class="badge">
                    <span class="badge-label">Identificación del Evento</span>
                    <span class="badge-numero">{{ $evento->id_eventoAdverso }}</span>
                </div>
            </div>
            <div class="info-row">
                <span class="info-label">Responsable</span>
                <span class="info-value">{{ $evento->jefe?->name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Categoría</span>
                <span class="info-value">{{ $evento->categoria?->nombre }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Área</span>
                <span class="info-value">{{ $evento->area?->nombre }}</span>
            </div>
            @if ($evento->clasificacion)
                <div class="info-row">
                    <span class="info-label">Clasificación</span>
                    <span class="info-value">{{ $evento->clasificacion }}</span>
                </div>
            @endif
            @if ($evento->relacionado_con)
                <div class="info-row">
                    <span class="info-label">Relacionado con</span>
                    <span class="info-value">{{ $evento->relacionado_con }}</span>
                </div>
            @endif
            @if ($evento->categorizacion)
                <div class="info-row">
                    <span class="info-label">Categorización</span>
                    <span class="info-value">{{ $evento->categorizacion }}</span>
                </div>
            @endif

            <p class="seccion">Descripción del análisis</p>
            <p style="color: #374151; font-size: 14px; white-space: pre-line;">{{ $evento->descripcion_analisis }}</p>

            @if ($esTecno)
                <p class="seccion">Análisis de tecnovigilancia</p>
                <div class="info-row">
                    <span class="info-label">Dispositivo</span>
                    <span class="info-value">{{ $tecno->nombre_dispositivo }} — {{ $tecno->marca }} {{ $tecno->modelo }} (Serie: {{ $tecno->serie }})</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Causa probable</span>
                    <span class="info-value">{{ implode(', ', $tecno->causa_probable ?? []) ?: '—' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Acciones correctivas y preventivas iniciadas</span>
                    <span class="info-value">{{ $tecno->acciones_correctivas ?: '—' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Reportó al fabricante/importador/distribuidor</span>
                    <span class="info-value">{{ $siNo($tecno->reportado_fabricante) }}@if ($tecno->fecha_reporte_fabricante) ({{ $tecno->fecha_reporte_fabricante->format('d/m/Y') }})@endif</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Dispositivo médico disponible para evaluación</span>
                    <span class="info-value">{{ $siNo($tecno->dm_disponible_evaluacion) }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">DM enviado al fabricante/importador/distribuidor</span>
                    <span class="info-value">{{ $siNo($tecno->dm_enviado_fabricante) }}</span>
                </div>
            @endif

            @if ($esFarma)
                <p class="seccion">Análisis de farmacovigilancia</p>
                @if ($evento->medicamentos && $evento->medicamentos->isNotEmpty())
                    <div class="info-row">
                        <span class="info-label">Medicamentos</span>
                        @foreach ($evento->medicamentos as $medicamento)
                            <span class="info-value" style="display: block;">{{ $medicamento->nombre }} <span style="font-weight: normal;">— {{ $medicamento->descripcion }}</span></span>
                        @endforeach
                    </div>
                @endif
                <div class="info-row">
                    <span class="info-label">Categorización</span>
                    <span class="info-value">{{ implode(', ', $farma->categorizacion ?? []) ?: '—' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Alergias</span>
                    <span class="info-value">{{ implode(', ', $farma->alergias ?? []) ?: '—' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Factores contributivos</span>
                    <span class="info-value">{{ $farma->factores_contributivos ?: '—' }}</span>
                </div>
            @endif

            <div class="alerta">
                <p style="margin: 0; color: #404b7c; font-size: 13px;">
                    Ya puede consultar este evento en el sistema, en la sección "Mis Eventos".
                </p>
            </div>
        </div>
        <div class="footer">
            <p>Clínica Central del Eje — Sistema de Eventos Adversos</p>
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </div>
</body>

</html>
