"use client";

import { useEffect, useState } from "react";
import "./support.css";

const STATUS = {
  open: "Aberto",
  in_progress: "Em atendimento",
  waiting_student: "Aguardando aluno",
  resolved: "Resolvido",
  closed: "Fechado"
};

const CATEGORY = {
  technical: "Problema técnico",
  access: "Acesso / Login",
  payment: "Pagamento",
  questions: "Questões / Simulados",
  study_plan: "Plano de estudos",
  suggestion: "Sugestão",
  other: "Outro"
};

export default function SupportClient() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    subject: "",
    category: "technical",
    priority: "normal",
    message: ""
  });
  const [reply, setReply] = useState("");

  async function loadTickets() {
    const response = await fetch("/api/support/tickets", { cache: "no-store" });
    const data = await response.json();
    setTickets(data.tickets || []);
    setLoading(false);
  }

  async function openTicket(id) {
    setSelected(String(id));
    const response = await fetch("/api/support/tickets/" + id, { cache: "no-store" });
    const data = await response.json();
    setDetail(data);
    await loadTickets();
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function createTicket(event) {
    event.preventDefault();
    const response = await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Não foi possível abrir o chamado.");
      return;
    }

    setForm({ subject: "", category: "technical", priority: "normal", message: "" });
    await loadTickets();
    await openTicket(data.ticket.id);
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!reply.trim() || !selected) return;

    const response = await fetch("/api/support/tickets/" + selected, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: reply })
    });
    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Não foi possível enviar a mensagem.");
      return;
    }

    setReply("");
    await openTicket(selected);
  }

  return (
    <div className="supportGrid">
      <aside className="ticketList">
        <div className="supportTitle">
          <span>MEUS CHAMADOS</span>
          <strong>{tickets.length}</strong>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : tickets.length ? (
          tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => openTicket(ticket.id)}
              className={selected === String(ticket.id) ? "active" : ""}
            >
              <div>
                <strong>#{ticket.id} · {ticket.subject}</strong>
                <span>{CATEGORY[ticket.category] || ticket.category}</span>
              </div>
              <small>
                {STATUS[ticket.status] || ticket.status}
                {ticket.student_unread > 0 ? " · " + ticket.student_unread + " nova(s)" : ""}
              </small>
            </button>
          ))
        ) : (
          <p>Nenhum chamado aberto.</p>
        )}
      </aside>

      <section className="supportMain">
        {detail?.ticket ? (
          <>
            <header>
              <div>
                <small>CHAMADO #{detail.ticket.id}</small>
                <h2>{detail.ticket.subject}</h2>
                <p>{CATEGORY[detail.ticket.category]} · {STATUS[detail.ticket.status]}</p>
              </div>
            </header>

            <div className="messages">
              {detail.messages.map((message) => (
                <div
                  key={message.id}
                  className={"message " + (message.sender_role === "student" ? "mine" : "admin")}
                >
                  <strong>{message.sender_role === "student" ? "Você" : "Suporte ESTIBORDO"}</strong>
                  <p>{message.body}</p>
                  <small>{new Date(message.created_at).toLocaleString("pt-BR")}</small>
                </div>
              ))}
            </div>

            {detail.ticket.status !== "closed" && (
              <form className="reply" onSubmit={sendReply}>
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Escreva sua resposta..."
                  maxLength={5000}
                />
                <button type="submit">Enviar mensagem</button>
              </form>
            )}
          </>
        ) : (
          <form className="newTicket" onSubmit={createTicket}>
            <span>CENTRAL DE SUPORTE</span>
            <h1>Como podemos ajudar?</h1>
            <p>
              Abra um chamado para problemas de acesso, funcionalidades, pagamentos ou dúvidas
              sobre a plataforma.
            </p>

            <label>
              Assunto
              <input
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                maxLength={140}
                required
              />
            </label>

            <div className="row">
              <label>
                Categoria
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  {Object.entries(CATEGORY).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label>
                Prioridade
                <select
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                >
                  <option value="low">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="high">Alta</option>
                </select>
              </label>
            </div>

            <label>
              Descreva o problema
              <textarea
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                maxLength={5000}
                required
                placeholder="Conte o que aconteceu, em qual página e o que você esperava que acontecesse."
              />
            </label>

            <button type="submit">Abrir chamado</button>
          </form>
        )}
      </section>
    </div>
  );
}
