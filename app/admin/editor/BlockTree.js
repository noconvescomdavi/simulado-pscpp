"use client";
function label(block){return block.title||block.text||block.quote||block.placeholder||block.type}
function Node({block,depth,selectedId,onSelect,onReparent}){
  const isContainer=["container","group","stack","grid"].includes(block.type);
  return <div className="ev-block-tree-item">
    <button type="button" draggable className={"ev-block-node "+(selectedId===block.id?"is-active ":"")+(isContainer?"is-container":"")}
      style={{paddingLeft:7+depth*7}}
      onDragStart={e=>{e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("application/x-estibordo-block",block.id);e.currentTarget.classList.add("is-dragging")}}
      onDragEnd={e=>e.currentTarget.classList.remove("is-dragging")}
      onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move";e.currentTarget.classList.add("is-drop-target")}}
      onDragLeave={e=>e.currentTarget.classList.remove("is-drop-target")}
      onDrop={e=>{e.preventDefault();e.stopPropagation();e.currentTarget.classList.remove("is-drop-target");const source=e.dataTransfer.getData("application/x-estibordo-block");if(source&&onReparent)onReparent(source,block.id)}}
      onClick={()=>onSelect(block.id)}>
      <i>⋮⋮</i><small>{block.type}</small><span>{label(block)}</span>{isContainer&&<em>solte aqui</em>}
    </button>
    {(block.children||[]).length>0&&<div className="ev-block-children">{block.children.map(child=><Node key={child.id} block={child} depth={depth+1} selectedId={selectedId} onSelect={onSelect} onReparent={onReparent}/>)}</div>}
  </div>
}
export default function BlockTree({blocks,selectedId,onSelect,onReparent}){
  if(!(blocks||[]).length)return <div className="ev-block-tree"><p className="ev-drawer-empty">Nenhum bloco criado pelo editor nesta página.</p></div>;
  return <div className="ev-block-tree">{blocks.map(block=><Node key={block.id} block={block} depth={0} selectedId={selectedId} onSelect={onSelect} onReparent={onReparent}/>)}</div>
}