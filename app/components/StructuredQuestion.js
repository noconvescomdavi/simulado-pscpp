import styles from "./structured-question.module.css";
import { classifyQuestionStructure } from "../../lib/question-structure";

function Text({children}){return <span className={styles.text}>{children}</span>}

export default function StructuredQuestion({question,showOptions=false,optionRenderer}){
  const structure=question?.structure || classifyQuestionStructure(question);
  const blocks=structure?.blocks?.length?structure.blocks:[{type:"stem",text:question?.question||""}];
  const options=structure?.options?.length===question?.options?.length?structure.options:(question?.options||[]);
  return <div className={styles.question} data-question-structure={structure?.type||"simple"}>
    <div className={styles.content}>{blocks.map((block,index)=>{
      if(block.type==="assertions")return <ol className={styles.assertions} key={index}>{block.items.map(item=><li key={item.label}><b>{item.label})</b><Text>{item.text}</Text></li>)}</ol>;
      if(block.type==="columns")return <div className={styles.columns} key={index}><section><h4>COLUNA A</h4><div>{block.columnA}</div></section><section><h4>COLUNA B</h4><div>{block.columnB}</div></section></div>;
      return <p className={styles.stem} key={index}>{block.text}</p>;
    })}</div>
    {showOptions&&<div className={styles.options}>{options.map((option,index)=>optionRenderer?optionRenderer(option,index):<div className={styles.option} key={index}><b>({String.fromCharCode(97+index)})</b><Text>{option}</Text></div>)}</div>}
  </div>
}