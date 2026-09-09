# NV2 Chart Viewer V2

Versão experimental focada em **reduzir falsos positivos** ao abrir cartas Navionics `.nv2`.

## O que mudou
- não interpreta mais qualquer sequência de `float64` como latitude/longitude;
- procura assinatura NAVIONICS;
- testa `int32` LE/BE em múltiplas escalas geográficas;
- reconhece semicircles;
- tenta blocos zlib/deflate;
- exige continuidade espacial e score mínimo de 78%;
- se não houver confiança suficiente, **não desenha lixo binário**;
- inclui `nv2probe.py` para diagnóstico offline no Windows.

## Execução no Windows
Extraia o ZIP e execute `start_windows.bat`. Depois abra o endereço indicado e selecione o arquivo `.nv2`.

Também é possível executar:
```
python nv2probe.py caminho\carta.nv2 -o diagnostico.json
```

## Limitação
NV2 é um formato proprietário. Esta versão melhora substancialmente a detecção estrutural, mas não afirma suportar toda a simbologia Navionics. O objetivo é identificar geometria verdadeira com alta confiança e produzir diagnóstico útil para ampliar o decoder.

## Próxima camada de compatibilidade
O caminho de maior fidelidade é uma ponte nativa Windows para componentes originais do software Navionics, caso o pacote fornecido contenha DLL/API reutilizável. Isso deve ser feito sem redistribuir componentes proprietários.
