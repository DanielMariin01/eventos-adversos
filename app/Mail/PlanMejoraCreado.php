<?php

namespace App\Mail;

use App\Models\EventoAdverso;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PlanMejoraCreado extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public EventoAdverso $evento) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Plan de Mejora Asignado - Evento N° ' . $this->evento->id_eventoAdverso,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.plan-mejora-creado',
        );
    }
}
