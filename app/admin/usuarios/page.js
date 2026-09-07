import {query} from "../../../lib/db";

export const dynamic="force-dynamic";

function date(value){
  return value ? new Date(value).toLocaleDateString("pt-BR") : "—";
}

export default async function Page({searchParams}){
  const q=await searchParams;
  const r=await query(`
    select
      u.id,
      u.email,
      u.role,
      u.status,
      main.status as access_status,
      main.expires_at,
      tutor.status as tutor_status,
      tutor.expires_at as tutor_expires_at
    from users u
    left join user_access main
      on main.user_id=u.id
     and main.product_code='pscpp-vitalicio'
    left join user_access tutor
      on tutor.user_id=u.id
     and tutor.product_code='tutor-ia-mensal'
    order by u.created_at desc
    limit 200
  `);

  return <main className="wrap admin-wrap">
    <div className="admin-heading">
      <div>
        <span className="eyebrow">ADMINISTRAÇÃO</span>
        <h1>Usuários</h1>
        <p className="muted">Gerencie o acesso principal e a assinatura do CONTRAMESTRE individualmente.</p>
      </div>
    </div>

    {q?.msg&&<div className="admin-notice">{q.msg}</div>}

    <div className="table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>E-mail</th>
            <th>Conta</th>
            <th>Plano anual</th>
            <th>Validade anual</th>
            <th>CONTRAMESTRE</th>
            <th>Validade CONTRAMESTRE</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {r.rows.map(u=><tr key={u.id}>
            <td><strong>{u.email}</strong></td>
            <td>{u.role} · {u.status}</td>
            <td><span className={`status ${u.access_status==="active"?"status-active":""}`}>{u.access_status||"pending"}</span></td>
            <td>{date(u.expires_at)}</td>
            <td>
              <span className={`status ${u.tutor_status==="active"&&u.tutor_expires_at&&new Date(u.tutor_expires_at)>new Date()?"status-active":""}`}>
                {u.tutor_status==="active"&&u.tutor_expires_at&&new Date(u.tutor_expires_at)>new Date()?"ativo":u.tutor_status||"inativo"}
              </span>
            </td>
            <td>{date(u.tutor_expires_at)}</td>
            <td>
              <div className="admin-actions">
                <form action={`/api/admin/users/${u.id}/access`} method="post">
                  <input type="hidden" name="product" value="pscpp"/>
                  <input type="hidden" name="action" value="active"/>
                  <button className="mini mini-good">Ativar plano · 365 dias</button>
                </form>

                <form action={`/api/admin/users/${u.id}/access`} method="post" style={{display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"}}>
                  <input type="hidden" name="product" value="contramestre"/>
                  <input type="hidden" name="action" value="active"/>
                  <input
                    name="duration_days"
                    type="number"
                    min="1"
                    max="3650"
                    defaultValue="30"
                    aria-label="Dias de acesso ao CONTRAMESTRE"
                    style={{width:"82px",padding:"7px 8px",border:"1px solid #cfdce5",borderRadius:"6px"}}
                  />
                  <span style={{fontSize:"10px"}}>dias</span>
                  <button className="mini mini-good">Ativar CONTRAMESTRE</button>
                </form>

                {u.access_status==="active"&&(
                  <form action={`/api/admin/users/${u.id}/access`} method="post">
                    <input type="hidden" name="product" value="pscpp"/>
                    <input type="hidden" name="action" value="revoked"/>
                    <button className="mini mini-danger">Revogar assinatura</button>
                  </form>
                )}

                {u.tutor_status==="active"&&(
                  <form action={`/api/admin/users/${u.id}/access`} method="post">
                    <input type="hidden" name="product" value="contramestre"/>
                    <input type="hidden" name="action" value="revoked"/>
                    <button className="mini mini-danger">Revogar CONTRAMESTRE</button>
                  </form>
                )}

                {u.status!=="suspended"&&u.status!=="deleted"&&(
                  <form action={`/api/admin/users/${u.id}/status`} method="post">
                    <input type="hidden" name="status" value="suspended"/>
                    <button className="mini mini-warn">Suspender conta</button>
                  </form>
                )}

                {u.status!=="blocked"&&u.status!=="deleted"&&(
                  <form action={`/api/admin/users/${u.id}/status`} method="post">
                    <input type="hidden" name="status" value="blocked"/>
                    <button className="mini mini-danger">Bloquear conta</button>
                  </form>
                )}

                {["suspended","blocked"].includes(u.status)&&(
                  <form action={`/api/admin/users/${u.id}/status`} method="post">
                    <input type="hidden" name="status" value="active"/>
                    <button className="mini mini-good">Reativar conta</button>
                  </form>
                )}

                {u.status!=="deleted"&&(
                  <form action={`/api/admin/users/${u.id}/status`} method="post">
                    <input type="hidden" name="status" value="deleted"/>
                    <button className="mini mini-danger">Excluir conta</button>
                  </form>
                )}
              </div>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </main>;
}
