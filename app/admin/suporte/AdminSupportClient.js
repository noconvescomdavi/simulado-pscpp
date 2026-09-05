"use client";

import { useState } from "react";
import "./support-admin.css";

const STATUS = {
  open: "Aberto",
  in_progress: "Em atendimento",
  waiting_student: "Aguardando aluno",
  resolved: "Resolvido",
  closed: "Fechado"
};

export default function AdminSupportClient({ initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [reply, setReply] = useState("");

  async function refresh() {
    const response = await fetch("/api/admin/support", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setTickets(data.tickets || []);
    }
  }

  async function openTicket(id) {
    setSelected(String(id));
    const response = await fetch("/api/admin/support/" + id, { cache: "no-store" });
    const data = await response.json();
    setDetail(data);
    await refresh();
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!reply.trim() || !selected) return;

    const response = await fetch("/api/admin/support/" + selected, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: reply })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data.error || "Não foi possível enviar a resposta.");
      return;
    }

    setReply("");
    await openTicket(selected);
  }

  async function changeStatus(status) {
    if (!selected) return;

    const response = await fetch("/api/admin/support/" + selected, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data.error || "Não foi possível alterar o status.");
      return;
    }

    await openTicket(selected);
  }

  return (
    <main className="adminSupport">
      <aside>
        <header>
          <h1>Suporte</h1>
          <span>{tickets.filter((ticket) => ticket.admin_unread > 0).length} não lidos</span>
        </header>

        {tickets.length ? (
          tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => openTicket(ticket.id)}
              className={selected === String(ticket.id) ? "active" : ""}
            >
              <strong>#{ticket.id} {ticket.subject}</strong>
              <span>{ticket.full_name || ticket.email}</span>
              <small>
                {STATUS[ticket.status]}
                {ticket.admin_unread ? " · " + ticket.admin_unread + " nova(s)" : ""}
              </small>
            </button>
          ))
        ) : (
          <p className="emptyList">Nenhum chamado recebido.</p>
        )}
      </aside>

      <section>
        {detail?.ticket ? (
          <>
            <header>
              <div>
                <small>CHAMADO #{detail.ticket.id}</small>
                <h2>{detail.ticket.subject}</h2>
                <p>{detail.ticket.full_name || detail.ticket.email}</p>
              </div>

              <select
                value={detail.ticket.status}
                onChange={(event) => changeStatus(event.target.value)}
                aria-label="Status do chamado"
              >
                {Object.entries(STATUS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </header>

            <div className="adminMessages">
              {detail.messages.map((message) => (
                <article
                  key={message.id}
                  className={message.sender_role === "admin" ? "mine" : ""}
                >
                  <strong>
                    {message.sender_role === "admin"
                      ? "Administração"
                      : message.full_name || message.email}
                  </strong>
                  <p>{message.body}</p>
                  <small>{new Date(message.created_at).toLocaleString("pt-BR")}</small>
                </article>
              ))}
            </div>

            {detail.ticket.status !== "closed" && (
              <form onSubmit={sendReply}>
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Responder ao aluno..."
                  maxLength={5000}
                />
                <button type="submit">Enviar resposta</button>
              </form>
            )}
          </>
        ) : (
          <div className="empty">
            <h2>Caixa de entrada de suporte</h2>
            <p>Selecione um chamado para responder.</p>
          </div>
        )}
      </section>
    </main>
  );
}
