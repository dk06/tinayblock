const {ipcMain} = require('electron');

var usbDetect = require('usb-detection');

var player = require('play-sound')(opts = {});

var Web3 = require('web3');

// const bitcoin = require('bitcoinjs-lib');

const assert = require('assert')

const wif = require('wif')

// Do some detection
usbDetect.startMonitoring();

var IChaKey=require('../js/IChaKey.js');


var MIN_CHAR_INPUT_SUPPORT_VERSION=0x81;

var lasterror;

var mIChaKey=new IChaKey();

var bIsFoundChaKey=false;

var Ver;

var g_Event;

var bInputStatus=false;

var alice ;


function SendErrMsg(event,ErrMsg)
{
    event.sender.send('ErrMsg', ErrMsg)
}

function SendMsg(event,Msg)
{
    event.sender.send('Msg', Msg)
}

function SendErrMsgEx(event,ErrMsg)
{
    mIChaKey.myErrMsgbox(ErrMsg,lasterror,event);
}

var gRetObj= {
                ret : 5,
                retval:null,
                errTips : "",
                successTips : "",
                cmd:"",
            };

function SendResult(event)
{
    event.sender.send('RetVal', gRetObj);
}



//get ChaKey's infomation.
function FindChaKey(InMsg)
{
    var ErrGetVer="There is a error when Get ChaKey's version,Error code is:"
    var ErrGetVerEx="There is a error when Get ChaKey's extern version ,Error code is:"
    var ErrGetChipID="There is a error when Get ChaKey's ID ,Error code is:"
    var MsgMoreChaKey="more than 1 ChaKey on system,Pls insert one ChaKey."
    var MsgNoChaKey="Can not find ChaKey."
   
    var ChaKeyCount=mIChaKey.FindChaKey();
    //if have more ChaKey in system?
    if (ChaKeyCount==1)
    {
        SendErrMsg(g_Event,MsgMoreChaKey);return ;
    }
    // if no ChaKey in system?

    if (ChaKeyCount==-1)
    {
        bIsFoundChaKey=false;
        g_Event.sender.send('GetChipID', '');
        //send out key msg;
        if(InMsg!=null)
        {
            SendErrMsg(g_Event,InMsg);return ;
        }
        SendErrMsg(g_Event,MsgNoChaKey);return ;
    }
    bIsFoundChaKey=true;

    // if found ChaKey,get ChaKey's infomation.
    if(bIsFoundChaKey)
    {
        // get ChaKey's version.
        //out : if GetLastError==0, return ChaKey's version
        Ver=mIChaKey.GetVersion();
        lasterror=mIChaKey.GetLastError();
        if(lasterror!=0)
        {
            SendErrMsgEx(g_Event,ErrGetVer);
        }
        // get ChaKey's extern version.
        //out : if GetLastError==0, return ChaKey's extern version
        var VerEx=mIChaKey.GetVersionEx();
        lasterror=mIChaKey.GetLastError();
        if(lasterror!=0)
        {
            SendErrMsgEx(g_Event,ErrGetVerEx);
        }
        // get ChaKey's ID
        //out : if GetLastError==0, return ChaKey's ID
        var ID=mIChaKey.GetChipID();
        lasterror=mIChaKey.GetLastError();
        if(lasterror!=0)
        {
            SendErrMsgEx(g_Event,ErrGetChipID);
        }
        g_Event.sender.send('GetChipID', ID);

        GetPinStatus(g_Event);//get pin status;
    } 

}

if(ipcMain){
    ipcMain.on('onFindChaKey', (event, arg) => {

        g_Event=event;
    
        FindChaKey(null);
        
       });
        
      //if have ChaKey
      function ExistChaKey()
      {
        var ErrMsgInsertChaKey='Pls Insert ChaKey first.';
         if(!bIsFoundChaKey)
         {
            SendErrMsg(event,ErrMsgInsertChaKey);
            return false;  
         }
         return true;
      }
    
    function CheckInputStatus(event)
    {
        var ErrMsgGetInputStutas='there was a error when get ChaKey info,Error code is:';
        var MsgIsInputStatusInfo="pls input pin";
        var MsgIsNotInputStatusInfo="not input status";
    
        var tmp_bInputStatus=mIChaKey.GetInputStatus();
        lasterror=mIChaKey.GetLastError();
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrMsgGetInputStutas);  
        }
        if(bInputStatus!=tmp_bInputStatus)
        {
            bInputStatus=tmp_bInputStatus;
            if(bInputStatus)
            {
                SendMsg(event,MsgIsInputStatusInfo);
            }
            else
            {
                SendMsg(event,MsgIsNotInputStatusInfo);
            }
        }
        
    }
    
      ////////////////LB & RB /////////////
      ipcMain.on('onLeftBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        
        var ErrSendBntCmdTips="there was a error when LB click.error code is:  ";
        //send LB -But msg to ChaKey.
        //in param 1:LB or RB
        //out : Err==0 //sucess else error
        lasterror= mIChaKey.ChaKeySendLRBnt( IChaKey.BNT_LB);
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrSendBntCmdTips);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
      })
    
      ipcMain.on('onRightBnt', (event, arg) => {
        if(!ExistChaKey())return ;
    
        var ErrSendBntCmdTips="here was a error when RB click.error code is:  ";
         //send LB -But msg to ChaKey.
        //in param 1:LB or RB
        //out : Err==0 //sucess else error
        lasterror= mIChaKey.ChaKeySendLRBnt( IChaKey.BNT_RB );
        if (lasterror!=0) 
        {
        SendErrMsgEx(event,ErrSendBntCmdTips);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
      })
      ///////////////////
    
      ////// Input Pin by soft-Keyboard;
    
     /////////////////Input num or letter
     ipcMain.on('onUpBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        var ErrInputUp="There was a error when Up input,error code is: ";
       //Input Pin,.
      //in param 1:value of move Input >0 up input < 0 down input
      //out : Err==0 //sucess else error
      lasterror= mIChaKey.ChaKeyMoveNumber( 1);
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrInputUp);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
    })
    
    ipcMain.on('onDownBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        var ErrInputDown="There was a error when down input,error code is: ";
         //Input Pin,.
       //in param 1:value of move Input >0 up input < 0 down input
       //out : Err==0 //sucess else error
      lasterror= mIChaKey.ChaKeyMoveNumber( -1);
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrInputDown);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
    })
    ////////////////////////////////  
    
    /////////////Change Input:Num, letter. 
    ipcMain.on('onNumberMenuBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        if(Ver<MIN_CHAR_INPUT_SUPPORT_VERSION)
        {
            SendMsg(event,'This version not support char input.');return ;
        }
        var ErrChangeInput="There was a error when chage input char to 0-9,error code is: ";
        //Change Input,.
       //in param 1:num, A-M ,or N-Z
       //out : Err==0 //sucess else error
       lasterror= mIChaKey.ChaKeyChangePage( IChaKey.NUM_CHAR);
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrChangeInput);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
      })
    
      ipcMain.on('onA_M_MenuBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        if(Ver<MIN_CHAR_INPUT_SUPPORT_VERSION)
        {
            SendMsg(event,'This version not support char input.');return ;
        }
        var ErrChangeInput="There was a error when chage input char to A-M,error code is: ";
        //Change Input,.
      //in param 1:num, A-M ,or N-Z
      //out : Err==0 //sucess else error
       lasterror= mIChaKey.ChaKeyChangePage( IChaKey.A_M_CHAR);
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrChangeInput);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
      })
    
      ipcMain.on('onN_Z_MenuBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        if(Ver<MIN_CHAR_INPUT_SUPPORT_VERSION)
        {
            SendMsg(event,'This version not support char input.');return ;
        }
        var ErrChangeInput="There was a error when chage input char to N-Z,error code is: ";
        //Change Input,.
        //in param 1:num, A-M ,or N-Z
        //out : Err==0 //sucess else error
       lasterror= mIChaKey.ChaKeyChangePage( IChaKey.N_Z_CHAR);
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrChangeInput);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
      })
      //////////////////////////////////////  
    
    ////////////////////del input
    ipcMain.on('onBackspaceBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        var ErrBackSpace="There wasa error when backspace,error code is: ";
        //Del Input,.
        //out : Err==0 //sucess else error
        lasterror= mIChaKey.ChaKeyBackspace( );
           if (lasterror!=0) 
           {
            SendErrMsgEx(event,ErrBackSpace);  
           }
           //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
     })
    ////////////////////
    
    /////move cursor 
    ipcMain.on('onBackCursorBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        var ErrMoveCursor="There wasa error when back cursor,error code is: ";
        //move Input cursor ,.
       //in param 1:value of move cursor >0 right  < 0 left
       //out : Err==0 //sucess else error
       lasterror= mIChaKey.ChaKeyMoveCursor( -1);
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrMoveCursor);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
     });
     
     ipcMain.on('onForwardCursorBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        var ErrMoveCursor="There was a error when forward cursor,error code is: ";
       //move Input cursor ,.
       //in param 1:value of move cursor >0 right  < 0 left
       //out : Err==0 //sucess else error
       lasterror= mIChaKey.ChaKeyMoveCursor(1);
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrMoveCursor);  
        }
        //set timer to check input status
        setTimeout(function () {CheckInputStatus(event);}, 200);
     });
    ////////////////////
    //////////////////confirm or cancel input
    ipcMain.on('onCancelInputBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        g_ErrTips="There was a error when cancel to input password : ";
        g_Tips="already cancel. ";
        //cancel Input ,.
       //out : Err==0 //sucess else error
       lasterror=mIChaKey.ChaKeyCancelInputPin();
    
        if( lasterror != 0){SendErrMsgEx(event,g_ErrTips);return ;}
        SendMsg(event,g_Tips);
        bInputStatus=false;
    
    }); 
    
    function GetPinStatus(event)
    {
        //Get ChaKey's Pin Status   
        //out : if GetLastError==0, return Pin Status 1:pin open  0: pin not open  -1: pin not set
        var bPinStatus=mIChaKey.GetPinStatus();
        lasterror=mIChaKey.GetLastError();
        if(lasterror!=0)
        {
            SendErrMsgEx(event,"There is a error when get Chakey pin status,errcode is:");
        }
        else
        {
            if(bPinStatus==1)
            {
                bIsChaKeyOpen=true;
                SendMsg(event,"Cha Key was Inserted. And Pin was opened.");
            }
            else 
            {
                if(bPinStatus==0)
                {
                    SendMsg(event,"Cha Key was Inserted. And Pin was not opened.");
                }
                else
                {
                    SendMsg(event,"Cha Key was Inserted. And Pin no set.");
                }
            }
            CheckInputStatus(event);//check input status
        }
    }
    
    
    ipcMain.on('onConfirmInputBnt', (event, arg) => {
        if(!ExistChaKey())return ;
    
       var ErrConfirmInfo="There was a error when confirm pin,error code is:";
       //var Tips="Pin already open.";
       
        //Confirm Input ,.
       //out : Err==0 //sucess else error
       lasterror =  mIChaKey.ChaKeyConFirmPin();
        if(lasterror != 0 )
        {
            SendErrMsgEx(event,ErrConfirmInfo);
            return ;
        }
        else
        {
            //SendMsg(event,Tips);//don't show success msg.
        }     
    
    });
    /////////////////////////////////////////////////////////// 
    
    /////other  
     ///show/hide  pin
     ipcMain.on('onShowPinBnt', (event, arg) => {
        if(!ExistChaKey())return ;
        var ErrShowPin="There was a error when Show pin,error code is: ";
       //Show/hide Pin ,toggle
       //out : Err==0 //sucess else error
       //notice,!!!! there is a bug in this version ,can not toggle ,next version will fix it.
       lasterror =  mIChaKey.ChaKeyShowPin()
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrShowPin);  
        }
        CheckInputStatus(event);//check input status
     });
     
    //Show/hide SerialNum  
    ipcMain.on('onShowSerialBnt', (event, arg) => {
        if(!ExistChaKey())return ;
     var ErrShowSerialNum="There was a error when Show serial number,error code is: ";
     //Show/hide SerialNum ,toggle
       //out : Err==0 //sucess else error
       lasterror =  mIChaKey.ChaKeyShowSerialNumber()
        if (lasterror!=0) 
        {
        SendErrMsgEx(event,ErrShowSerialNum);  
        }
        CheckInputStatus(event);//check input status
    });
    /////////////////////////////////////////////////////////// 
    
    
    ////////////////////sub function of pay/////////
    function GetUserAction(lasterror ,Paystatus,CB,txb)
    {
        if(Paystatus.CountDown>0 && lasterror==IChaKey._WAITFOR_USER_ACTION)
        {
            player.play('./Windows Ding.wav', (err) => {
                if (err) console.log(`Could not play sound: ${err}`);
            });
            
        }
        if(lasterror!=0)return;
        if(Paystatus.Status== IChaKey.CONFIRM)//pay 
        {
              CB(txb);
               return true;
        }
        else 
        {  
            if(Paystatus.Status== IChaKey.CANCEL)//cancel pay be user
            {
                SendMsg(g_Event,"The user cancel to pay.")
            }
            else//over  pay time. 
            {
                SendMsg(g_Event,"over pay time , cancel to pay.")
            }
            return false;
        }
                
    }
    
    function TestVerfBtc(txb)
    {
        // const tx = bitcoin.Transaction.fromHex(txb.build().toHex());
    
        // const p2pkh = bitcoin.payments.p2pkh({
        //     pubkey: alice.publicKey,
        //     input: tx.ins[0].script
        // })
    
        // const ss = bitcoin.script.signature.decode(p2pkh.signature)
        // const hash = tx.hashForSignature(0, p2pkh.output, ss.hashType)
    
        assert.strictEqual(alice.verify(hash, ss.signature), true)
        SendMsg(g_Event,"payed.");;
    }
    ////////////////////////////////  Pay  //////////////////////////////////////////////
    
    ///////Test BTC Pay 
    ipcMain.on('onTestBTCPayBnt', (event, FirstLineString, SecondLineString) => { 
    
        //clear All KeyPairs on ChaKey,Only test , in real produce will disable
        lasterror=mIChaKey.ClearTokens();
        if(lasterror!=0)
        {
            SendErrMsgEx(event,'err clear tokens');return ;
        }
        
        var rnd=new Buffer('e6748a8100c409001ffee09d965622f45e5df7b3f5a8573293b01f374492f29c', 'hex' ); 
        var PriKey=wif.encode(128,rnd,true);
        // alice = bitcoin.ECPair.fromWIF(PriKey)
    
        // Add Keypairs into ChaKey
        //in param 1:token name
        //in param 2:KeyPair
        //in param 3:type of Token 
        //out : Err==0 sucess else error
        lasterror=mIChaKey.AddKeyPairs('BTC',alice,IChaKey.BTC_SIGNTYPE);
        if(lasterror!=0)
        {
            SendErrMsgEx(event,'err Add KeyPairs');return ;
        }
    
        // add another Keypair into ChaKey
        var rnd_2=new Buffer('8c112cf628362ecf4d482f68af2dbb50c8a2cb90d226215de925417aa9336a48', 'hex' ); 
        var PriKey_2=wif.encode(128,rnd_2,true);
        // const alice_2 = bitcoin.ECPair.fromWIF(PriKey_2)
    
        lasterror=mIChaKey.AddKeyPairs('BTC_2',alice_2,IChaKey.BTC_SIGNTYPE);
        if(lasterror!=0)
        {
            SendErrMsgEx(event,'err Add KeyPairs_2');return ;
        }
    
        // get total KeyPairs Count of ChaKey.in this case ,is two.
        //out : Count of Keypairs in ChaKey, if GetLastErr()==0 sucess else error
        var TokensCount=mIChaKey.GetTokensCount();
        if(mIChaKey.GetLastError()!=0)
        {
            SendErrMsgEx(event,'err GetTokensCount');
        }
        var KeyPairInfo; var n;
        //enumerate Keypairs's info from 
        for(n=0;n<TokensCount;n++)
        {
            //list TokensName in ChaKey by index
            //in param 1:Keyparis index
            //out : Count of Keypairs in ChaKey, if GetLastErr()==0 sucess else error
            KeyPairInfo=mIChaKey.ListTokensName(n);
            console.log("the "+n.toString() +" Keypairs info is:"+KeyPairInfo)
    
            //Export PubKey by Index of TokensName.
            //in Param 1:TokensName's Index.
            //out: if lasterr==0, return PubKey of TokensName; else reuturn Null,errcode =lasterr.
            var TokenPublic=mIChaKey.ExportPubKeyByIndex(n);
            if(mIChaKey.GetLastError()!=0)
            {
                SendErrMsgEx(event,'err ExportPubKeyByIndex');return ;
            }
            console.log("the "+n.toString() +" KeyPairs publickey  is:"+TokenPublic)
           
        }
        var txb = new bitcoin.TransactionBuilder();
        txb.setVersion(1)
        txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0) // Alice's previous transaction output, has 15000 satoshis
        txb.addOutput('1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP', 12345678)
        mIChaKey.Hash_SetToAddr('1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP')//new addition
        // (in)15000 - (out)12000 = (fee)3000, this is the miner fee
    
       // txb.sign(0, alice)//old sign by sofeware
    
        //following code alse can work
        /*lasterror=txb.ChaKeySign(0,0, function(lasterror,Paystatus)
        {
            GetUserAction(lasterror,Paystatus,TestVerfBtc)
        });*/
    
        //Sign by Chakey
        //in Param 1: transaction
        //in Param 2: token's name or index,
        //in Param 3: if show serial number
        //in Param 4: call back
        //out: if err==0, success else fail.
        //tips: when user comfirm or cancel on Chakey,call back will be call.
        //lasterror of CB ,if lasterror==0, success else fail.
        //Paystatus of CB, Cancel , payed or overtime.
       lasterror=txb.ChaKeySign(0,'BTC', true,function(lasterror,Paystatus)
        {
            GetUserAction(lasterror,Paystatus,TestVerfBtc,txb)
        });
        if (lasterror!=0) 
        {
    
                SendErrMsgEx(event,"err sign");  return ;
        }
        else
        {
               SendMsg(event,"pls comfirm on ChaKey.");return ;
        }
        
    });
    ///////////////////////
    
    function TestVerEth(tx)
    {
        const serializedTx = tx.serialize()
    
        var infura_ley = '5GZBABYhPzfctlTOIiXu'
        var networkUrl = 'https://ropsten.infura.io/'+infura_ley;
        web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
        
        SendMsg(g_Event,"payed.");
    
        web3.eth.sendSignedTransaction(
            `0x${serializedTx.toString('hex')}`, 
            (error, result) => { 
                if (error) { console.log(`Error: ${error}`); }  
                else { console.log(`Result: ${result}`); } 
            } 
            );
    } 
    
    ///////Test BTC Pay 
    ipcMain.on('onTestETHPayBnt', (event, FirstLineString, SecondLineString) => { 
    
        const EthereumTx = require('ethereumjs-tx')
    
        //clear All KeyPairs on ChaKey,Only test , in real produce will disable
        lasterror=mIChaKey.ClearTokens();
        if(lasterror!=0)
        {
            SendErrMsgEx(event,'err clear tokens');return ;
        }
    
        const privateKey = Buffer.from('e6748a8100c409001ffee09d965622f45e5df7b3f5a8573293b01f374492f29c', 'hex')
        var PriKey=wif.encode(128,privateKey,true);
        const alice = bitcoin.ECPair.fromWIF(PriKey)
    
        // Add Keypairs into ChaKey
        //in param 1:token name
        //in param 2:KeyPair
        //in param 3:type of Token 
        //out : Err==0 sucess else error
        lasterror=mIChaKey.AddKeyPairs('ETH',alice,IChaKey.ETH_SIGNTYPE);
        if(lasterror!=0)
        {
            SendErrMsgEx(event,'err Add KeyPairs');return ;
        }
    
        const privateKey_2 = Buffer.from('8c112cf628362ecf4d482f68af2dbb50c8a2cb90d226215de925417aa9336a48', 'hex')
        var PriKey_2=wif.encode(128,privateKey_2,true);
        const alice_2 = bitcoin.ECPair.fromWIF(PriKey_2)
    
        lasterror=mIChaKey.AddKeyPairs('eth_2',alice_2,IChaKey.ETH_SIGNTYPE);
        if(lasterror!=0)
        {
            SendErrMsgEx(event,'err AddKey Pairs_2');return ;
        }
    
        // get total KeyPairs Count of ChaKey.in this case ,is two.
        //out : Count of Keypairs in ChaKey, if GetLastErr()==0 sucess else error
        var TokensCount=mIChaKey.GetTokensCount();
        if(mIChaKey.GetLastError()!=0)
        {
            SendErrMsgEx(event,'err GetTokensCount');return ;
        }
        var KeyPairInfo; var n;
        //enum Keypairs's info from 
        for(n=0;n<TokensCount;n++)
        {
             //list TokensName in ChaKey by index
            //in param 1:Keyparis index
            //out : Count of Keypairs in ChaKey, if GetLastErr()==0 sucess else error
            KeyPairInfo=mIChaKey.ListTokensName(n);
            console.log("the "+n.toString() +" Keypairs info is:"+KeyPairInfo)
    
            //Export PubKey by Index of TokensName.
            //in Param 1:TokensName's Index.
            //out: if lasterr==0, return PubKey of TokensName; else reuturn Null,errcode =lasterr.
            var TokenPublic=mIChaKey.ExportPubKeyByIndex(n);
            if(mIChaKey.GetLastError()!=0)
            {
                SendErrMsgEx(event,'err ExportPubKeyByIndex');return ;
            }
            console.log("the "+n.toString() +" KeyPairs publickey  is:"+TokenPublic)
           
        }
    
        web3 = new Web3(Web3.currentProvider);
     
        const txParams = {
        nonce: '0x00',
        gasPrice: '0x09184e72a000', 
        gasLimit: '0x2710',
        to: '0x000000000000000000000000000000000000abc', 
        //value: '123456789', 
        value:web3.utils.toWei('1', 'ether'),
        data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
        // EIP 155 chainId - mainnet: 1, ropsten: 3
        chainId: 3
        }
        
        var tx = new EthereumTx(txParams)
        // tx.sign(privateKey)
    
        //following code alse can work
        /*lasterror=tx.ChaKeySign(0, function(lasterror,Paystatus)
        {
            GetUserAction(lasterror,Paystatus,TestVerEth)
        });*/
    
        //Sign by Chakey
        //in Param 1: token's name or index,
        //in Param 2: //show numer on Chakey
        //in Param 3: call back
        //out: if err==0, success else fail.
        //tips: when user comfirm or cancel on Chakey,call back will be call.
        //lasterror of CB ,if lasterror==0, success else fail.
        //Paystatus of CB, Cancel , payed or overtime.
        lasterror=tx.ChaKeySign('ETH', true,function(lasterror,Paystatus)
        {
            GetUserAction(lasterror,Paystatus,TestVerEth,tx)
        });
        if (lasterror!=0) 
        {
    
                SendErrMsgEx(event,"err sign");  return ;
        }
        else
        {
               SendMsg(event,"pls comfirm on ChaKey.");return ;
        }
        
    });
    ////Ini Verification code 
    function IniVerfCode(event,bIsDisable)
    {
        event.sender.send('IniVerfCode',bIsDisable)
    }
    ///////////////////////
    
    //Confirm Pay
    ipcMain.on('onConfirmPayBnt', (event, VerfCode) => {
        if(!ExistChaKey())return ;
            var ErrShowVerfCodeInfo="There is a error when show verification code,.errcode is:";
            var ErrTooFewInfo="Verification code is too few,pls input again.";
            var Tips="already show verfication code on ChaKey,Pls input this code and pay again.";
            // var SuccessTips="Already pay.";
            var ErrConfirmInfo="There was a error when confirm pay,error code is:";
            if(VerfCode.length<1)
            {
                //show verification code to ChaKey's screen and wait for the user input this code.
                //out : Err==0 //sucess else error
            lasterror=mIChaKey.ChaKeyShowVerfCode();
            if( lasterror !=0 ) {SendErrMsgEx(event,ErrShowVerfCodeInfo);return;}
            IniVerfCode(event,false);
            SendMsg(event,Tips);
            return  ;
            }
            else
            {
            //lenght of verfication code == IChaKey.CHAKEY_PWD_LEN ?
            if(VerfCode.length <  IChaKey.CHAKEY_PWD_LEN){SendErrMsg(evnet,ErrTooFewInfo);return ;}
                //confirm pay ,.
                //in param 1:verfication code , if this code equal verfication code in Chakey, Pay else error.
                //out : Err==0 //sucess else error
            lasterror=  mIChaKey.ChaKeyConFirmPay(VerfCode)
            IniVerfCode(event,true);
            if(lasterror != 0 )
            {
                SendErrMsgEx(event,ErrConfirmInfo);
                return false;
            }
            else
            {
                //don't show tips,because ChaKeyShowAddrString will return result of pay or not pay.
                //  SendMsg(SuccessTips);
            }
    
            }
    });
    ///////////////////////
        
    //////////////////////////Cancel Pay
    ipcMain.on('onCancelShowAddrstringBnt', (event, arg) => {
        if(!ExistChaKey())return ;
            var ErrCancelShowAddrString="There was a error when clear show to ChaKey,error code is: ";
            //var  g_Tips="already cancel.";
            
            //cancel pay ,.
            //out : Err==0 //sucess else error
        lasterror=mIChaKey.ChaKeyCancelShowAddrString();
    
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrCancelShowAddrString);  
        }
        else
        {
            //don't show tips,because ChaKeyShowAddrString will return result of pay or not pay.
            // ShowMessage(g_Tips,"Tips");
            IniVerfCode(event,true);
        }
    
    });
    ///////////////////////
      
    
     //////move showAddrString cursor 
     ipcMain.on('onRight_showAddrString', (event, VerfCode) => {
        var ErrMoveAddrString="There was a error when move addr string  to right,error code is: ";
         //move showAddrString cursor ,.
        //in param 1:value of move cursor >0 right  < 0 left
        //out : Err==0 //sucess else error
        lasterror=  mIChaKey.ChaKeyMoveAddrStringCursor( 1 );
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrMoveAddrString);  
        }
    
    });
       
    ipcMain.on('onLeft_showAddrString', (event, VerfCode) => {
        var ErrMoveAddrString="There was a error when move addr string  to left,error code is: ";
        //move showAddrString cursor ,.
        //in param 1:value of move cursor >0 right  < 0 left
        //out : Err==0 //sucess else error
        lasterror=  mIChaKey.ChaKeyMoveAddrStringCursor( -1 );
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrMoveAddrString);  
        }
    
    });
    ///////////////////////
    
     /////show addr num.
     ipcMain.on('onShowAddrNumBnt', (event, arg) => {
        var ErrShowAddrNum="There was a error when Show Addr number,error code is: ";
         //Show/hide addr AddrNum ,toggle
         //out : Err==0 //sucess else error
         lasterror= mIChaKey.ChaKeyShowAddrNumber( );
        if (lasterror!=0) 
        {
            SendErrMsgEx(event,ErrShowAddrNum);  
        }
    });
    ///////////////////////
    
    ///////////////////////Only show addr string
    ipcMain.on('onShowAddress_Only_Bnt', (event, FirstLineString_Only,SecondLineString_Only) => {
    
        var ErrShowAddrString="There was a error when show addr. string to ChaKey,error code is:  ";
        var   OutAnserData ="";
    
        //firest cancel it ,in the next version, won't this code.
        //cancel last show addr. string.
        //out param 1 Err,==0 //sucess else error
        mIChaKey.ChaKeyCancelShowAddrString();
        
            //show addr. string (only)
            //in param 1: first line string.
            //in param 2:second line string
            //in param 3: if only show addr. string ,this param is "".
            //in param 4:  show addr. string number or not, true is show , false is hide .
            //out : Err==0 //sucess else error
            lasterror=mIChaKey.ChaKeyShowAddrString( FirstLineString_Only, SecondLineString_Only,"", true);
            if (lasterror!=0) 
            {
                SendErrMsgEx(event,ErrShowAddrString);  
            }
            else
            {
                SendMsg(event,"Already show..")
    
            }
    });
      ////////////////////////////////////////
        
        
       //////reset ChaKey to factory status.
       /////////,improtant !!!!!!!!!!!!!!!, this only be used by us ,!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    ipcMain.on('onReSetChaKeyBnt', (event, arg) => {
           var ErrReSetChaKey="There was a error when reset ChaKey,error code is: ";
               // Reset ChaKey 
               ////out :Err==0 //sucess else error
               lasterror=mIChaKey.ReSetChaKey( );
                if (lasterror!=0) 
                {
                SendErrMsgEx(event,ErrReSetChaKey);  return ;
                
                }
                SendMsg(event,"Already Reset.Pls Re-Inset the ChaKey.");
    
    });
}
////////////////////////////////

///ChaKey pnp event
usbDetect.on('add', function(device) { 
    if(mIChaKey.MacthChaKeyID(device))
    {

        mIChaKey.CloseChaKey()
    
        setTimeout(function () {FindChaKey(null);}, 500);
       
                
    }
 });

 usbDetect.on('remove', function(device) { 

    if(mIChaKey.MacthChaKeyID(device))
    { 
        
        bInputStatus=false;

        mIChaKey.CloseChaKey()

        setTimeout(function () {FindChaKey('ChaKey was out of system.');}, 500);
    }

});

module.exports.mIChaKey=mIChaKey;
module.exports.lasterror=lasterror;
module.exports.usbDetect=usbDetect;