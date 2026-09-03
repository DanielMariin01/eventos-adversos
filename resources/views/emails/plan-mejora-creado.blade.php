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
            background: #7c3aed;
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

        .alerta {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
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
    <div class="container">
        <div class="header">
            <h1>Evento Adverso Asignado</h1>
        </div>
        <div class="body">
            <p>Se le ha asignado un plan de mejora para el siguiente evento adverso:</p>
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
                <span class="info-label">Área</span>
                <span class="info-value">{{ $evento->area?->nombre }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Categoría</span>
                <span class="info-value">{{ $evento->categoria?->nombre }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Fecha límite ejecución</span>
                <span class="info-value">{{ $evento->planMejora?->fecha_ejecucion }}</span>
            </div>
            <div class="alerta">
                <p style="margin: 0; color: #92400e; font-size: 13px;">
                    Por favor ingrese al sistema y suba la evidencia de ejecución del plan de mejora antes de la fecha
                    límite.
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
