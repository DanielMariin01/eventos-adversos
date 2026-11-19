<?php

namespace App\Mail;

use App\Models\EventoAdverso;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AnalisisRealizado extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public EventoAdverso $evento) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Análisis Realizado - Evento N° ' . $this->evento->id_eventoAdverso,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.analisis-realizado',
        );
    }
}
