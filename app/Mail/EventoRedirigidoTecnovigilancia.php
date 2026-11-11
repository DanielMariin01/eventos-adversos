<?php

namespace App\Mail;

use App\Models\EventoAdverso;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventoRedirigidoTecnovigilancia extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public EventoAdverso $evento,
        public ?string $categoriaAnterior = null,
        public ?string $observacion = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Evento Adverso N° ' . $this->evento->id_eventoAdverso . ' direccionado a Tecnovigilancia',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.evento-redirigido-tecnovigilancia',
        );
    }
}
