# MixΞtherio
La seguente Dapp è il progetto ufficiale per lo stage Universitario presso l'Universita degli Studi Milano Bicocca. 

Il seguente Mixer NON è stabile e potrebbe presentare dei bug, pertanto non se ne consiglia un utilizzo diretto sulla blockchain ufficiale di Ethereum. 

The following Mixer IS NOT stable and safe. So I suggest to use it only in a test net.

## Obiettivo 
Studio e implementazione di un mixer per criptovalute. Lo studente apprenderà alcuni principi di sicurezza informatica relativi al mondo delle criptovalute. Imparerà inoltre a implementare smart contract in linguaggio Solidity, per Ethereum. I mixer vengono utilizzati nel mondo delle criptovalute per nascondere l'origine dei token usati per i pagamenti, e di conseguenza l'identità del loro proprietario. Nel corso di questo stage verranno studiate le tecniche attualmente utilizzate per implementare tali mixer. Si proporrà inoltre l'implementazione di un servizio di mixing basato sui principi di confusione e diffusione che sono alla base dei moderni crittosistemi simmetrici. Un prototipo del servizio verrà implementato sotto forma di smart contract scritto nel linguaggio Solidity, e verrà testato in un ambiente controllato.

## Comandi per L'avvio di una Dapp
E' necessario avere la suite di truffle, ganache e ganacheUi. Inoltre serve avere anche node ed npm. 
Per creare un nuovo progetto con i seguenti comandi:
```Terminal
cd /PathDelNuovoProgetto
mkdir my-dapp
cd my-dapp
```
è necessario che la cartella ``` my-dapp ``` sia vuota.
Poi digitare: 
```Terminal
truffle unbox react 
```
una volta terminato si potranno digitare i seguenti comandi da terminale per avviare il tutto: 
```
truffle compile // compilare i contratti 
truffle migrate // per minarli sulla blockchain che si sta utilizzando 
truffle migrate --reset // se ci sono state delle modifiche e si vuole ri-minare il contratto
cd client
npm run test // lanciare i test per la dapp 
npm run start // avviare l'applicazione decentralizzata
```
## Implementazione
E' stata sviluppata un'applicazione decentralizzata (Dapp). Nella cartella smartc ontracts si trovano tutti i contratti sviluppati per il Mixer. Il contratto MixEtherio è lo smart contract principale. 
Nella cartella client si trova una applicazione react. 
