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
            background: #0d9488;
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
            background: #5564A8;
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
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .info-label {
            color: #6b7280;
            font-size: 14px;
        }

        .info-value {
            color: #111827;
            font-size: 14px;
            font-weight: bold;
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
    <div class="container">
        <div class="header">
            <h1>Nuevo Evento Adverso Reportado</h1>
        </div>
        <div class="body">
            <p>Se ha reportado un nuevo evento adverso</p>
            <div style="text-align: center; margin: 20px 0;">
                <div class="badge">
                    <span class="badge-label">Identificación del Evento</span>
                    <span class="badge-numero">{{ $evento->id_eventoAdverso }}</span>
                </div>
            </div>
            <div class="info-row">
                <span class="info-label">Fecha del evento</span>
                <span class="info-value">{{ $evento->fecha_evento?->format('Y-m-d') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Categoría</span>
                <span class="info-value">{{ $evento->categoria?->nombre }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Área</span>
                <span class="info-value">{{ $evento->area?->nombre }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Reportado por</span>
                <span class="info-value">{{ $evento->reportante?->nombres }}
                    {{ $evento->reportante?->apellidos }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Paciente</span>
                <span class="info-value">{{ $evento->paciente?->nombres }} {{ $evento->paciente?->apellidos }}</span>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px 0;"><strong>Descripción:</strong></p>
                <p style="color: #111827; font-size: 13px; margin: 0;">{{ $evento->descripcion }}</p>
            </div>
        </div>
        <div class="footer">
            <p>Clínica Central del Eje — Sistema de Eventos Adversos</p>
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </div>
</body>

</html>
