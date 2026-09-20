import fs from 'node:fs';
import path from 'node:path';
import {appendToFloor,assertUniqueIds} from './lib/question-expansion.mjs';

const root=process.cwd();
const bankPath=path.join(root,'data','questions','navegacao-aguas-restritas.json');
const bank=JSON.parse(fs.readFileSync(bankPath,'utf8'));
const P=(a,b)=>[a,b];
const pairs=[
  P('plano de rebocadores','Planejamento que deve acordar comandos, limites operacionais, pontos de aplicação e resposta à perda de um rebocador antes da aproximação ao porto.'),
  P('critério de aborto da manobra','Gatilho previamente acordado que compara posição, velocidade, falhas e ambiente para permitir abandonar a manobra enquanto ainda existe margem de recuperação.'),
  P('aproximação ao berço','Fase em que devem ser controlados separadamente velocidade longitudinal, velocidade lateral, ângulo de aproximação e energia restante.'),
  P('portões de velocidade e distância','Limites intermediários usados para verificar se a energia do navio está sendo reduzida a tempo de concluir a aproximação com segurança.'),
  P('emprego de rebocadores no porto','Uso que considera força, direção, ponto de conexão, fase da manobra e risco de girting antes de solicitar ações ao rebocador.'),
  P('margem de recuperação','Espaço e tempo ainda disponíveis para reduzir energia, interromper a aproximação ou executar contingência antes de ultrapassar um ponto sem retorno.'),
  P('controle da energia de aproximação','Prática de reduzir velocidade com antecedência e verificar se defensas, rebocadores e propulsão remanescente podem absorver ou controlar o movimento.'),
  P('manobra dentro dos limites portuários','Condução que integra espaço restrito, tráfego, vento, corrente, rebocadores, berço e capacidade de abortagem em um único plano operacional.')
];
const r=appendToFloor({
  bank,
  subjectId:'III',
  subjectSlug:'navegacao-aguas-restritas',
  prefix:'NAR',
  bibliographyId:'nayak-nav',
  sectionKey:'ch13',
  pairs,
  source:{author:'NAYAK, Santosha K.',title:'Theory and Practices of Marine Pilotage',edition:'2. ed., 2021 (arquivo fornecido)',locator:'Chapter 13 — Manoeuvring Inside Harbour Limits'},
  module:'Praticagem e condução em canais, rios e portos',
  floor:25
});
assertUniqueIds(bank);
fs.writeFileSync(bankPath,JSON.stringify(bank,null,2)+'\n');
fs.writeFileSync(path.join(root,'reports','navegacao-aguas-restritas-followup-expansion.json'),JSON.stringify({generated_at:new Date().toISOString(),key:'nayak-nav::ch13',before:r.before,after:r.after,added:r.added.length},null,2)+'\n');
console.log(JSON.stringify({key:'nayak-nav::ch13',before:r.before,after:r.after,added:r.added.length},null,2));
