// JScript source code

var HID = require('node-hid')

var ChaKeyPath=null;

var GETVERSION = 0x01;
var GET_PIN_STATUS =0x02;
var GET_ATM_TIMES= 0x03;
var SHOW_ADDR_NUMBER=0X04;
var GETVEREX= 0x05;
var CANCLE_SHOW_ADDR_STRING=0x06;
var CONFIRM_PAY=0x07;
var BACKSPACE_NUM = 0x08;
var GET_CHIPID = 0x53;
var SETHIDONLY = 0x55;
var SETREADONLY = 0x56;
var CHANGE_PAGE = 0xD0;
var MOVE_CURSOR = 0xD1;
var SWOW_SERIRAL = 0xD2;
var SHOW_PIN = 0xD3;
var MOVE_NUM = 0xD4;
var SHOW_VERF_CODE = 0xD5;
var VERIFY_REG_CODE = 0xD6;
var CONFIRM_PIN = 0xD7;
var CANCEL_INPUT_PIN = 0xD8;
var SHOW_UNLOCK_CODE = 0xDA;
var GET_LIMIT_TIMES = 0xDC;
var GET_OVER_TIME = 0xDD;
var SET_INVERSE_DISPLAY = 0xDF;
var SET_CHAKEY_TIME = 0xE0;
var READ_SEC_STRING = 0xE3;
var WRITE_SEC_STRING = 0xE4;
var SHOW_ADDR_STRING = 0xE5;
var MOVE_ADDR_STRING_CURSOR = 0xE6;
var GET_CHAKEY_INFO = 0xE7;
var BNT_CMD =0xEC;
var GET_VERF_CODE = 0xED;
var BNT_LONG_PRESS = 0xEE;
var RESET = 0XEB;

var GET_TOKENS_COUNT = 0x91;
var ADD_KEYPAIRS = 0x92;
var DEL_KEYPAIRS_BY_INDEX = 0x93;
var CLEAR_TOKENS= 0x94;
var LIST_TOKENS_NAME = 0x95;
var EXP_PUBKEY_BY_INDEX = 0x96;
var EXP_PUBKEY_BY_NAME = 0x97;
var SEL_KEYPAIRS_BY_INDEX = 0x98;
var SEL_KEYPAIRS_BY_NAME = 0x99;
var HASH256_INI = 0x9A;
var HASH256_BUF = 0x9B;
var PLAY_SIGN=0x9C;
var KCC_INI=0X9D;
var KCC_BUF=0X9E;
var KCC_SIGN=0X9F;


var BTC_SIGNTYPE = 0;
var ETH_SIGNTYPE = 1;


//errcode 
var OVER_MAX_TOKENS_COUNT= -8
var OVER_TOKENS_COUNT= -9
var ERR_WRITE_EPROM= -10
var ERR_READ_EPROM= -11
var ERR_NOT_FOUND_TOKEN_NAME= -12

/*var FAILEDGENKEYPAIR= -21;
var FAILENC         = -22
var FAILDEC         = -23
var FAILPINPWD   = -24
var EEPROMOVERCONST = -25 //
*/

/*var NOTOPENFILE= -31//
var NOTREADFILE= -32 //*/
var ERR_UNLOCK_INVAILDT= -33
var ERR_VERF_CODE_MORE= -34
var ERR_SIGN_TYPE= -35
var ERR_TOKENNAME_EXIST= -36
var ERR_PRICE_OVER= -37
var ERR_NOT_DEC_NUM= -38

/*var NOTWRITEFILE= -42 //
var TRANFSERFAIL = -45 //
var ERRWRITEPASSWORD= -47 //
var ERRREADPASSWORD= -48 //
var EPPROMOVERADD = -49 //

var USBStatusFail= -50  //
var OPENUSBFAIL = -51  //
var ENCERROR  = -52 //
var NOUSBORDRIVER  = -53 //
var LESSCOUNT     = -55  //
var GETVARERROR  = -56   //*/


var PIN_NO_SET= -61
var NOT_INPUT_PIN_STATUS= -62
var INVAIL_PAY_CMD= -63
/*var NotVaildFile     = -65  //
var ERRORKEY     = -66  //
var OVERLEN   = -67
var SETCMPFAIL= -68  //
//var WAITFOR_USER_ACTION= -69  */

var ERR_HASH_NULL= -70
var ERR_HASH_INPUT_TOO_LONG= -71
var ERR_HASH_STATE= -72
var ERR_KCC_INI  = -73
var ERR_KCC_HASH  = -74

var ERR_OVER_SEC_MAX_LEN = -88
var ERR_ID_NOT_MATCH =-83
var ERR_VERFCODE_INVAILDT =-84
var ERR_OVER_ADDR_STRING_LEN=-85
var ERR_ADDR_NOT_MATCH =-86;

var NOT_INVALID_ACTION= -91
var NOCHAKEY  = -92 //not found ChaKey

var CHA_KEY_NOT_OPEN = -108
var ERR_OVER_TRANSE_LEN= -109
var ERR_CHA_PWD   = -111
var I2C_ERROR        = -112
var ERR_NOT_SAME    = -113
var ERR_OVER_LIMIT_TIMES= -114
var ERR_NO_STARTINPUT= -115
var ERR_NEW_PWD_LESS= -116
var ERR_OVER_OPERATION_TIME= -117
var ERR_VERF_CODE= -118
var ERR_OVER_VERF_COUNT= -119
var OVER_CUSTOM_INFO_ADDR= -120
var OVER_CUSTOM_INFO_PAGE= -121
var ERR_RESET   = -122
var ERR_ALREADY_SETPWD= -123
var ERR_REMOTE_REGCODE_TOO_LESS = -124
var ERR_REMOTE_REGCODE_INVAILD = -125
var ERR_REMOTE_REGCODE_ID_NOT_RIGHT= -126
var ERR_REMOTE_REGCODE_UNLOCK_NOT_RIGHT= -127

 //other err code of App
 var ERR_VERF_CODE_APP=-1001;
 var ERR_ID_NOT_MACTCH_APP=-1002;
 var ERR_GET_STRING_LEN_APP=-1003;

var MAX_SEC_STRING_LEN = 2048;
var MAX_TRANSE_LEN = 255;
var MAX_DATA_LEN=(MAX_TRANSE_LEN-1);
var MAX_SIGN_LEN=(MAX_TRANSE_LEN-2);

//var RSA_LEN=256;

var  _WAITFOR_USER_ACTION = -69;
var  WAITFOR_USER_ACTION = 187;

var SOFTWAVE_VERFCODE_LEN=10;
var MAX_ADDR_STRING_BUF_LEN=(70);

var TOKENNAME_LEN = 10;

var ECC_LEN =32;

//这里之所以只需要接收方的地址的们位移，这个是根据ETH合约的格式来决定的，只要接收方的位移确定了，就可以再进一步确定价钱的位移，且不能被改变
//因为他是RLP编码，每个字段的第一位是长度，
//这里的位移是包含第一个编码的位移
var ETHHashData= {
    ToOffset : 0,
    buf:null,
  };

//这里之所以是价钱的位置，是因为价钱之后就是接收方，主要价钱的位移及长度固定了，我们就可以确定接收方的位移了，且不能被改变
var BTCHashData= {
    PriceOffset:0,
    ToOffset : 0,
    Addr:"",
    buf:null,
  };
class IChaKey 
{
    IChaKey() {
        //connection object
        IChaKey.connection=null;

    }

    GetLastError()
    {
        return this.lasterror;
    }

    MacthChaKeyID(mDevices)
    {
        if ((mDevices.vendorId == IChaKey.VID && mDevices.productId == IChaKey.PID) ||
        (mDevices.vendorId == IChaKey.VID_NEW && mDevices.productId == IChaKey.PID_NEW))
        {
            return true;
        }
        return false
    }

    CloseChaKey()
    {
        if((ChaKeyPath!=null))
        {  
            ChaKeyPath=null;
        }
    }

   FindChaKey() {
        var count=0;
        var devices = HID.devices()
        devices.forEach(mDevice=>{  
            if (this.MacthChaKeyID(mDevice))
            {
                ChaKeyPath=mDevice.path;
                count++; 
            }
        });
        if(count==0)return -1;
        if(count>1)return 1;
        
        return 0;
    }

    

////bin2hex  & hex2bin     
   ByteArrayToHexString(Inb,len)
   {
        var outstring = "";
        for (var n = 0 ;n<= len - 1;n++)
        {
            outstring = outstring +this.myhex(Inb[n]) ;
        }
        return outstring;
   }
     
HexStringToByteArray(InString)
    {
         var nlen;
         var retutn_len;
         var n,i;
         var b;
         var temp;
         nlen = InString.length;
         if (nlen < 16) retutn_len = 16;
         retutn_len = nlen / 2;
         b = new Uint8Array[retutn_len];
         i = 0;
         for(n=0;n<nlen;n=n+2)
         {
             temp = InString.substring( n, n+2);
             b[i] = this.HexToInt(temp);
             i = i + 1;
          }
          return b;
     }
 ////////    


//decimal to hex && hex2dec	
   myhex(value) {
    if (value < 16)
      return '0' + value.toString(16);
    return value.toString(16);
    };

	
    HexToInt( s)
    {
        var hexch ="0123456789ABCDEF";
        var i, j;
        var r, n, k;
        var ch;
        s=s.toUpperCase();

        k = 1; r = 0;
        for (i = s.length; i > 0; i--)
        {
            ch = s.substring(i - 1,  i-1+1);
            n = 0;
            for (j = 0; j < 16; j++)
            {
                if (ch == hexch.substring(j, j+1) )
                {
                    n = j;
                }
            }
            r += (n * k);
            k *= 16;
        }
        return r;
    };
////////////////

///// int2Hex fixed lenght 
  Int2HexFixedLen( Indate ,  nlen )
  {
        var n;
        var tmp_len;
        var OutString="";
        OutString = this.myhex(Indate);
        tmp_len =OutString.length;
        for( n = tmp_len;n<= nlen - 1;n++)
        {
            OutString = "0" + OutString;
        }
         return OutString;
}
///////

////////////// string to bytes
    stringToBytes ( str ) {  
      var ch, st, re = [];  
      for (var i = 0; i < str.length; i++ ) {  
        ch = str.charCodeAt(i);  // get char   
        st = [];                 // set up "stack"  
        do {  
          st.push( ch & 0xFF );  // push byte to stack  
          ch = ch >> 8;          // shift value down by 1 byte  
        }    
        while ( ch );  
        // add stack contents to result  
        // done because chars have "wrong" endianness  
        re = re.concat( st.reverse() );  
      }  
      // return an array of bytes  
      return re;  
    }  
//////////////////
 Byte2Sting(Inb,start,nlen ) {  
      var n;
      var OutString="";
      for(n=0;n<nlen;n++)
      {
         OutString =OutString+ String.fromCharCode(Inb[start+n]);
      }
      return OutString;
    };  

 /////////////// send cmd only ,no carry data  
   SendNoWithData(CmdFlag) {
        var array_in = new Uint8Array(MAX_TRANSE_LEN) ; 
        this.SendWithData( CmdFlag,array_in);
        return this.lasterror;
 };
 ///////////////////////////
 
 ///////////send cmd and data
 SendWithData(CmdFlag,array_in) {
       
    this.lasterror=0;
    var featureReport = [2, 0];

    featureReport[1] = CmdFlag;

    for (var i = 1; i < MAX_TRANSE_LEN; i++) {
        featureReport[i + 1] =array_in[i];
    }
    var devices = HID.devices()
        devices.forEach(mDevice=>{  
            if (this.MacthChaKeyID(mDevice))
            {
                ChaKeyPath=mDevice.path;
            }
        });
    this.connection = new  HID.HID(ChaKeyPath)
    if(this.connection==null)
    {
        this.lasterror= NOCHAKEY;
        return undefined;
    }
    var Outlen=this.connection.sendFeatureReport( featureReport); 
    if(Outlen<2) {this.lasterror= ERR_SET_REPORT;this.connection.close();return undefined;}
    var array_out=this.connection.getFeatureReport(1,MAX_TRANSE_LEN) ;
    if(array_out.length<1){this.lasterror=ERR_GET_REPORT; this.connection.close();return undefined;}
    this.connection.close();

    if( array_out[0] != 0)
    {
        
        if(array_out[0]==WAITFOR_USER_ACTION)
         {
          if(array_out[1]!=0)
          {
            this.lasterror=array_out[1]- 256;
           }
           else
           {
             this.lasterror=0;
           }
            return array_out;
         }
        this.lasterror= array_out[0] - 256;
    }
    else
    {
        this.lasterror=0;
    }

    return array_out;

}
 ///////////////
 
 /////// send cmd and get one data from ChaKey
GetOneByteDataFromChaKey(cmd)
   {
   /* var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var array_out;
    array_out= this.SendWithData( cmd,array_in);
    if(this.lasterror!=0){return this.lasterror;}
    return array_out[1];*/
    return this.GetOneByteDataByPosFromChaKey(cmd,1);
   }
////////

//////////send cmd and get one data form ChaKey according position
GetOneByteDataByPosFromChaKey(cmd,pos)
   {
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var array_out;
    array_out= this.SendWithData( cmd,array_in);
    if(this.lasterror!=0){return this.lasterror;}
    return array_out[pos];
   }
///////////


 /////// send cmd and get one data from ChaKey
 SetOneByteData2ChaKey(cmd,data)
 {
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;

    array_in[1] = (data);

    this.SendWithData(cmd,array_in);

    return this.lasterror;
 }
////////
   
////////////////////////////////////////////////////////////////////////////////////

//Below is ChaKey'S function
//////////////////////////base info api

////get ChaKey's version
GetVersion()
{
    return this.GetOneByteDataFromChaKey(GETVERSION);
};
/////// 
    
////get ChaKey's extend version 
 GetVersionEx()
{
    return this.GetOneByteDataFromChaKey(GETVEREX);  
};
 /////
 	
 ////get ChaKey's ID
GetChipID()
{
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var array_out;

    var OutChipID = "";var outb=new Uint8Array(IChaKey.ID_LEN) ;

    array_out= this.SendWithData( GET_CHIPID,array_in);
    if(this.lasterror!=0){return ""}
    for( var n = 0 ;n<=(IChaKey.ID_LEN - 1);n++)
    {
        outb[n] = array_out[n + 1];
    }

    OutChipID = this.ByteArrayToHexString(outb, 16);
    OutChipID=OutChipID.toUpperCase();
    return OutChipID;
    
};
 ////////	
 	
/////Get Pin status
 GetPinStatus()
 	{
        return this.GetOneByteDataFromChaKey(GET_PIN_STATUS); 
 	};
 ///////	

/////////////Get Inputstatus
/////Get Pin status
GetInputStatus()
{
   return this.GetOneByteDataByPosFromChaKey(GET_CHAKEY_INFO,2); 
};
///////
////////
/////////////////////////////////////////////////Show addr. string API//////////////////////////////////////////////   

 ///////////////show addr. string to ChaKey. optional wait for user action
  ChaKeyShowAddrString(  FirstLineString,  SecondLineString, VerfCode, IsShowSerialNum)
    {
        var n;
    
        var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
        var b_1=[],b_2=[],bVerfCode=[];
        
        b_1=this.stringToBytes(FirstLineString);
 
        b_2=this.stringToBytes(SecondLineString);

        bVerfCode=this.stringToBytes(VerfCode);
        
        if( (b_1.length>= MAX_ADDR_STRING_BUF_LEN) || (b_2.length >= MAX_ADDR_STRING_BUF_LEN)) 
        {
            this.lasterror=IChaKey.ERR_OVER_ADDR_STRING_LEN;
            return this.lasterror;
        }

        array_in[1] = 1;
        if( ! IsShowSerialNum ) array_in[1] = 0;

        for( n = 0 ;n<= IChaKey.SOFTWAVE_VERFCODE_LEN - 1;n++)
        {
            array_in[2 + n] =bVerfCode[n];
        }
        
         for( n = 0 ;n<= b_1.length - 1;n++)
        {
            array_in[2 + IChaKey.SOFTWAVE_VERFCODE_LEN+ n] =b_1[n];
        }
         for( n = 0 ;n<= b_2.length - 1;n++)
        {
            array_in[2+IChaKey.SOFTWAVE_VERFCODE_LEN+MAX_ADDR_STRING_BUF_LEN/2+n] =b_2[n];
        }
        
        this.SendWithData(SHOW_ADDR_STRING, array_in);
    
        return   this.lasterror;
     
      
    }
  ///////
  
  ////// SUB wait for user action  
 WaitForUserAction()
    {
        var Paystatus= {
            Status : this.CANCEL,
            HashData:null,
            CountDown:-1,
        };

        if(this.bCancelWaitforUserAction)
        {
            this.lasterror=0;
            return Paystatus;
        }
        var devices = HID.devices()
        devices.forEach(mDevice=>{  
            if (this.MacthChaKeyID(mDevice))
            {
                ChaKeyPath=mDevice.path;
            }
        });
        this.connection = new  HID.HID(ChaKeyPath)
        if(this.connection==null)
        {
            this.lasterror= NOCHAKEY;
            return undefined;
        }
        var array_out=this.connection.getFeatureReport(1,MAX_TRANSE_LEN) ;
        this.connection.close();
        if(array_out.length<1){
            this.lasterror=ERR_GET_REPORT; 
            return Paystatus;
        }
    
        if( array_out[0] != 0)
        {
            this.lasterror= array_out[0] - 256;
            if(this.lasterror==IChaKey._WAITFOR_USER_ACTION)
            {
                if(array_out[2]>127)array_out[2]=array_out[2]-256;//get CountDown;
                Paystatus.CountDown=array_out[2];
            }
            else
            {
                Paystatus.CountDown=-1;
            }
            return Paystatus;
        }
        else
        {
            Paystatus.CountDown=-1;
            this.lasterror=0;
            Paystatus.HashData=Buffer.allocUnsafe(ECC_LEN*2+1);
            var n,temp;
            Paystatus.Status=array_out[1];
            for(n=3;n<19;n++)
            {
                temp=array_out[n];
                array_out[n]=array_out[37-n];
                array_out[37-n]=temp;

                temp=array_out[n+ECC_LEN];
                array_out[n+ECC_LEN]=array_out[37-n+ECC_LEN];
                array_out[37-n+ECC_LEN]=temp;
            }
            for(n=0;n<(ECC_LEN*2+1);n++)
            {
                Paystatus.HashData[n]=array_out[n+2];
            }
            return Paystatus;
        }

    }
 ////////////////// 
 
////////cancel show addr. string or cancel pay 
   
///cancel show addr. string or cancel pay 
ChaKeyCancelShowAddrString( )
    {
        return this.SendNoWithData(CANCLE_SHOW_ADDR_STRING);
    }
 //////////////////////
 
 ////////////////// Confirm pay with software keyboard.
 ChaKeyConFirmPay(VerfCode)
{
    var n;
    var nlen=(VerfCode.length);
    if(nlen>IChaKey.CHAKEY_PWD_LEN)nlen=IChaKey.CHAKEY_PWD_LEN;

    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var Buf=this.stringToBytes(VerfCode);

    for( n = 0 ;n<= nlen - 1;n++)
    {
        array_in[1 + n] =Buf[n];
    }
    this.SendWithData(CONFIRM_PAY, array_in);
    return this.lasterror;
}
//////
    
////// show verfcode , before confirm pay ,have to input verification code.
ChaKeyShowVerfCode()
    {
         return this.SendNoWithData(SHOW_VERF_CODE);
    }
 ///////////////   
 
 /////////move addr. string to left or right
ChaKeyMoveAddrStringCursor( step)
    {
        var array_in = new Uint8Array(MAX_TRANSE_LEN) ;

        array_in[1]=(step>>8);
        array_in[2]=step;

         this.SendWithData(MOVE_ADDR_STRING_CURSOR ,array_in);
         return this.lasterror;
    }
   /////////////////
   
   
 /// show addr. string serial number 
ChaKeyShowAddrNumber()
    {
        return this.SendNoWithData(SHOW_ADDR_NUMBER);
    }
//////////////////////////////////////////////////write and read security string api //////////////////////////////////////////////////////////////

///////////////////////////// sub funciont of read security bin data  from ChaKey   
/*
Sub_ChaKeyReadSecByte(Address,  nlen,  VerfRndCode)
    {
        var outData = new Uint8Array(nlen + IChaKey.SOFTWAVE_VERFCODE_LEN);
        var VerfRndCodeBuf=this.stringToBytes(VerfRndCode);
        var array_out;
        var ret;
        if( nlen > MAX_TRANSE_LEN )
        {
            this.lasterror=ERR_OVER_SEC_MAX_LEN;
            return outData;
         }
        if( (Address + nlen >= MAX_SEC_STRING_LEN) )
        {
            this.lasterror==ERR_OVER_SEC_MAX_LEN;
            return outData;
         }
    
        var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
        var  addr_l;
        var  addr_h;
        var n;
        var ret;

        addr_h = (Address>>8);
        addr_l = Address & 255;

        array_in[1] = addr_h;
        array_in[2] = addr_l;
        array_in[3] = nlen;
        
        
        for( n = 0 ;n<= IChaKey.SOFTWAVE_VERFCODE_LEN - 1;n++)
        {
            array_in[4 + n] = VerfRndCodeBuf[n];
        }
    
        array_out=this.SendWithData(READ_SEC_STRING, array_in);

        if(this.lasterror!=0){return outData;}
        for( n = 0 ;n<=(MAX_TRANSE_LEN - 1);n++)
        {
            outData[n] = array_out[n + 1];
        }
        return outData;

         
    }
/////////////////////

///////////////read security bin data  from ChaKey   
ChaKeyReadSecByte(Address,  nlen,  VerfRndCode )
    {  
        return  this.Sub_ChaKeyReadSecByte(Address,nlen,VerfRndCode);

    }
//////////////

///////////////read security string  from ChaKey  
 ChaKeyReadSecString( Address,  nlen,VerfRndCode )
    {
       var outData;
       outData=this.Sub_ChaKeyReadSecByte(Address,  nlen, VerfRndCode);
        if(this.lasterror!=0){return '';}
   
        var OutString=this.Byte2Sting(outData,0,outData.length);
        return OutString;
         
    }
  /////////////////////

sub_ChaKeyReadSecStringEx( SecStrObj,ChipID )
{
   
    var OutSecTxt = "";
    var VerfRandCode = "abcdef1234";//
   //read security  string 
    //in param 1: addr. of string .
    //in param 2: rand number,be used to verify that be payed by user ,not hacker.
    //out param 1 Err,==0 //sucess else error
    //out param 2: return security  string ,this data will be encrypt  next versoion, this version is explain. only test 
    var OutSecurityString=this.ChaKeyReadSecString( SecStrObj.Address, MAX_TRANSE_LEN, VerfRandCode);
    this.lasterror=this.GetLastError();
    if(this.lasterror!=0)
    {
        return this.lasterror;  
    }

    //if macth ID?
    if(OutSecurityString.substring(0,IChaKey.ID_LEN*2)!=ChipID)
    {
        this.lasterror=ERR_ID_NOT_MACTCH_APP;
        return this.lasterror;
    }
    
    //if macth verification code?
    if(OutSecurityString.substring(IChaKey.ID_LEN*2,IChaKey.ID_LEN*2 + IChaKey.SOFTWAVE_VERFCODE_LEN )!=VerfRandCode)
    {
        this.lasterror=ERR_VERF_CODE_APP;
        return this.lasterror;
    }
    
    // get Out security String 
   OutSecTxt= OutSecurityString.substring(IChaKey.ID_LEN*2 + IChaKey.SOFTWAVE_VERFCODE_LEN,IChaKey.MAX_TRANSE_LEN-1);
    if(SecStrObj.len==-1)
    {
        var pos=OutSecTxt.indexOf(",");
        if(pos>0)
        {
            SecStrObj.len=parseInt(OutSecTxt.substring(0,pos));
            if((SecStrObj.len+pos+1)>MAX_TRANSE_LEN)
            {
                var tmp_len=(MAX_TRANSE_LEN-(IChaKey.ID_LEN*2 + IChaKey.SOFTWAVE_VERFCODE_LEN+1));
                SecStrObj.OutSecTxt=OutSecTxt.substring(pos+1,tmp_len);
                SecStrObj.len=SecStrObj.len-tmp_len+pos+1;
                SecStrObj.Address=SecStrObj.Address+tmp_len;
            }
            else
            {
                SecStrObj.OutSecTxt=OutSecTxt.substring(pos+1,pos+1+SecStrObj.len);
                SecStrObj.len=0;
            }
        }
        else
        {
            this.lasterror=ERR_GET_STRING_LEN_APP;
            SecStrObj.OutSecTxt="";
            SecStrObj.len=0;
       }
       return SecStrObj;
   }
   if((SecStrObj.len+IChaKey.ID_LEN*2 + IChaKey.SOFTWAVE_VERFCODE_LEN)>MAX_TRANSE_LEN)
    {
        SecStrObj.OutSecTxt=SecStrObj.OutSecTxt+OutSecTxt;
        SecStrObj.len=SecStrObj.len-MAX_TRANSE_LEN+IChaKey.ID_LEN*2 + IChaKey.SOFTWAVE_VERFCODE_LEN+1;
        SecStrObj.Address=SecStrObj.Address+(MAX_TRANSE_LEN-(IChaKey.ID_LEN*2 + IChaKey.SOFTWAVE_VERFCODE_LEN))-1;
    }
    else
    {
        SecStrObj.OutSecTxt=SecStrObj.OutSecTxt+OutSecTxt.substring(0,SecStrObj.len);
        SecStrObj.len=0;
    }
    return SecStrObj;
}
////////////////////////////////
  ChaKeyReadSecStringEx(Address, ChipID )
  {
    var OutSecStrObj= {
        OutSecTxt : "",
        len : -1,
        Address:0,
    };

    OutSecStrObj.Address=Address;
    
    while(OutSecStrObj.len!=0)
    {
        this.sub_ChaKeyReadSecStringEx( OutSecStrObj,ChipID );
        if(this.lasterror!=0)return "";
    }
    return OutSecStrObj.OutSecTxt;
    
  }
  
 ///////////////////// sub funciton of write bin data   to ChaKey
Sub_ChaKeyWriteSecByte( InData,  nlen)
{  
        var n;
        var array_in = new Uint8Array(MAX_TRANSE_LEN) ;

        if( ((nlen) >= MAX_TRANSE_LEN) ) 
        {
            this.lasterror=ERR_OVER_TRANSE_LEN;
            return this.lasterror;
        }

        for( n = 0 ;n<= nlen - 1;n++)
        {
            array_in[1 + n] = InData[n];
        }

        this.SendWithData(WRITE_SEC_STRING, array_in);
        return this.lasterror;

}
//////////////

/////////////////////////////write security bin data  to ChaKey
ChaKeyWriteSecByte( InData,  nlen )
{
    return  this.Sub_ChaKeyWriteSecByte(InData,  nlen);
}

////////////////////////////////
sub_ChaKeyWriteSecStringEx( InString ,Address,ChipID)
{
    var  VerfRandCode;
    // get verfication code
    //out : if GetLastError==0,return verfication code
    VerfRandCode=this.ChaKeyGetVerfCode()
    this.lasterror=this.GetLastError();    
    if (this.lasterror!=0) 
    {
        return this.lasterror;
    }

    var SecString;


    //Cha's ID + Verfication code + addr.(hex4) + InString.length(hex2) + InString
    SecString = ChipID + VerfRandCode + this.Int2HexFixedLen(Address, 4) + this.Int2HexFixedLen(InString.length, 2) + InString;
    
    //////////////////////////////////////////////////////
    return this.ChaKeyWriteSecString(SecString)//SecString
     
}
///////////////////////////////
ChaKeyWriteSecStringEx(InString ,Address ,ChipID)
{
    var pos=0;
    var SecStringTxt=InString.length.toString()+ ","+InString;
    var head_len=IChaKey.ID_LEN*2 + IChaKey.SOFTWAVE_VERFCODE_LEN+4+2;
    var data_len=MAX_DATA_LEN-head_len;
    var len=SecStringTxt.length;
    while(len>data_len)
    {
        var tmpString=SecStringTxt.substring(pos,pos+data_len);
        this.lasterror=this.sub_ChaKeyWriteSecStringEx(tmpString,Address,ChipID);
        len=len-data_len;
        pos=pos+data_len;
        Address=Address+data_len;
        if(this.lasterror!=0)return this.lasterror;
    }
    var tmpString=SecStringTxt.substring(pos,pos+len);
    return this.sub_ChaKeyWriteSecStringEx(tmpString,Address,ChipID);
   
    
}

///////////////////////////////write security string    to ChaKey 
ChaKeyWriteSecString( InString )
{
        var n;

        var b=[];
        var outlen;
 
        b=this.stringToBytes(InString);
        outlen= b.length;

        return this.Sub_ChaKeyWriteSecByte(b,outlen);
}  
////////////////////////////////////*/

/////get verification code from ChaKey
/*
ChaKeyGetVerfCode()
    {
       var VerfCode = "";
       var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
       var array_out;
       array_out= this.SendWithData(GET_VERF_CODE, array_in);
       if(this.lasterror!=0)return '';
       VerfCode=this.Byte2Sting(array_out,1,IChaKey.SOFTWAVE_VERFCODE_LEN);
       return VerfCode;
    } 
    */
///////////////////////////////////


//////////////////////////////////simulation LB and RB //////////////////////////////////////////
 ChaKeySendLRBnt( Bnt)
    {
        return this.SetOneByteData2ChaKey(BNT_CMD,Bnt);
    }

/////////////////////////////////////////

/////////////////////////////////////////////////input pin soft keyboard api ////////////////////////////////////////////// 

///////confirm pin and cancel input pin

///////confirm  pin
ChaKeyCancelInputPin()
    {
       return  this.SendNoWithData(CANCEL_INPUT_PIN);
    }
 //////////////
  ///////cancel input pin
ChaKeyConFirmPin()
    {
        return this.SendNoWithData(CONFIRM_PIN)
    }
 //////////////
 
 ////// get times can be attemp
ChaKeyGetAttempTimes()
 	{
 	  return  this.GetOneByteDataFromChaKey(GET_ATM_TIMES);
        
 	};
 ///////////////	
 
 //////////////////////////////////////////////////////// 
 /////////////////////input pin number or letter
ChaKeyMoveNumber(step)
    {
        return this.SetOneByteData2ChaKey(MOVE_NUM,step);
    }
 
 ///////// move pin cursor
 ChaKeyMoveCursor(step)
    {
        return this.SetOneByteData2ChaKey(MOVE_CURSOR,step);
    }
 
 
 ///// change input 
ChaKeyChangePage(page)
    {
        return this.SetOneByteData2ChaKey(CHANGE_PAGE,page);
    }
    
   
 ////del iput 
 ChaKeyBackspace(  )
    {
        return  this.SendNoWithData(BACKSPACE_NUM);
    }

 
  ///////////show serial number 
ChaKeyShowSerialNumber()
    {
       return  this.SendNoWithData(SWOW_SERIRAL);
    }

//////// show pin
ChaKeyShowPin()
    {
        return  this.SendNoWithData(SHOW_PIN);
    }

  ///////////////////////////////////////////////////// other api  
   

//////////////get chakeyinfo,this version not use
/*    GetChaKeyInfo(cb)
    {
       var array_in = new Uint8Array(MAX_TRANSE_LEN) ;

        SendWithData(this.connection,GET_CHAKEY_INFO, array_in, function(lasterror,array_out)
         {
               
                cb( lasterror,DisplayStatus,IsEnableShowPWD,IsShowPWD,IsShowSerialNum);
         });
    }*/
//////////////////////////////


/////////Reset ChaKey ,improtant !!!!!!!!!!!!!!!, this only be used by us ,!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
ReSetChaKey(  cb )
    {
       var PWD="0955083171_0221";
       var n;
       var nlen=(PWD.length);
        var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
        var Buf=this.stringToBytes(PWD);

        for( n = 0 ;n<= nlen - 1;n++)
        {
            array_in[1 + n] =Buf[n];
        }
        this.SendWithData(RESET, array_in);
        return this.lasterror;
    }



///////////// Parsing error code 
SendErrMsg(event,ErrMsg)
{
    event.sender.send('ErrMsg', ErrMsg);
}

myErrMsgbox(info,ErrCode,event)
{ 

    var AttempTimes=0;
    var cstrErr;
    cstrErr=(ErrCode.toString());
    if( ErrCode == ERR_OVER_LIMIT_TIMES ){
        this.SendErrMsg(event,"ChaKey was locked");
             return ;
    }
    if( ErrCode != ERR_CHA_PWD)
    {
        switch(ErrCode)
        {
            case I2C_ERROR:
                this.SendErrMsg(event,info + cstrErr + "\n"  + "There is a error when oled show ");
                break;
            case ERR_NOT_SAME:
                this.SendErrMsg(event,info + cstrErr + "\n " + "Two password are not same when set new password");
                break;
            case ERR_OVER_LIMIT_TIMES:
                this.SendErrMsg(event,info + cstrErr + "\n " + "overtime when opare ChaKey");
                break;
            case ERR_OVER_TRANSE_LEN:
                this.SendErrMsg(event,info + cstrErr + "\n " + "data transmited was over length");
                break;
           /* case ERR_OVER_SEC_MAX_LEN:
                this.SendErrMsg(event,info + cstrErr + "\n " + "security data was over length");
                break;*/
            case ERR_NEW_PWD_LESS:
                this.SendErrMsg(event,info + cstrErr + "\n " + "new password's was too few,must be 8 character.");
                break;
            case ERR_OVER_OPERATION_TIME:
                this.SendErrMsg(event,info + cstrErr + "\n " + "operat over time.please restart input.");
                break;
            case ERR_VERF_CODE:
                this.SendErrMsg(event,info + cstrErr + "\n " + "Verif(ication code was error.");
                break;
            case ERR_OVER_VERF_COUNT:
                this.SendErrMsg(event,info + cstrErr + "\n " + "you inputed error too more,have to re-insert the ChaKey.if( that is not you handle by yourself,maybe there is a virus in your system ");
                break;
            case OVER_CUSTOM_INFO_ADDR:
                this.SendErrMsg(event,info + cstrErr + "\n " + "Custom info address overflow . ");
                break;
            case OVER_CUSTOM_INFO_PAGE:
                this.SendErrMsg(event,info + cstrErr + "\n " + "Custom info line overflow . ");
                break;
            case ERR_ALREADY_SETPWD:
                this.SendErrMsg(event,info + cstrErr + "\n " + "ChaKey Already set,Can no set againg.if( you want to re-set,pls reset this ChaKey. ");
                break;
            case ERR_REMOTE_REGCODE_TOO_LESS:
                this.SendErrMsg(event,info + cstrErr + "\n " + "Remote reg-code is too less. ");
                break;
            case ERR_REMOTE_REGCODE_INVAILD:
                this.SendErrMsg(event,info + cstrErr + "\n " + "Remote reg-code is not invaild. ");
                break;
            case ERR_REMOTE_REGCODE_ID_NOT_RIGHT:
                this.SendErrMsg(event,info + cstrErr + "\n " + "Remote reg-code is wrong,ID  isn't macth this ChaKey. ");
                break;
            case ERR_REMOTE_REGCODE_UNLOCK_NOT_RIGHT:
                this.SendErrMsg(event,info + cstrErr + "\n " + "Remote reg-code is wrong,unlock isn't right. ");
                break;
            case ERR_UNLOCK_INVAILDT:
                this.SendErrMsg(event,info + cstrErr + "\n " + "unlock code isn't invaild. ");
                break;
            case CHA_KEY_NOT_OPEN:
               this.SendErrMsg(event,info + cstrErr + "\n " + "ChaKey was not opened. ");
               break;
            case ERR_OVER_TRANSE_LEN:
               this.SendErrMsg(event,info + cstrErr + "\n " + "transe lenght was over. ");
               break;
            case  ERR_ID_NOT_MATCH:
                this.SendErrMsg(event,info + cstrErr + "\n " + "ChaKey's ID is not match. ");
                break;
            case ERR_VERFCODE_INVAILDT:
               this.SendErrMsg(event,info + cstrErr + "\n " + "verfication  code is invalid. ");
               break;
            case  NOT_INVALID_ACTION:
                this.SendErrMsg(event,info + cstrErr + "\n " + "action is invalid. ");
                break;
            case PIN_NO_SET:
                 this.SendErrMsg(event,info + cstrErr + "\n " + "pin no set. ");
                 break;
             case NOT_INPUT_PIN_STATUS:
                this.SendErrMsg(event,info + cstrErr + "\n " + "this operatin only work in input pin status.. ");
                break;
            case ERR_RESET:
               this.SendErrMsg(event,info + cstrErr + "\n" + "ReSet was error. ");
               break;
            case ERR_VERF_CODE_MORE:
              this.SendErrMsg(event,info + cstrErr + "\n" + "verification code is error too more.need re-logo. ");
              break;
            case INVAIL_PAY_CMD:
              this.SendErrMsg(event,info + cstrErr + "\n" + "invalid pay command. ");
              break;
            case ERR_VERF_CODE_APP:
              this.SendErrMsg(event,info + cstrErr + "\n" + "verficaton code is error. ");
            case ERR_ID_NOT_MACTCH_APP:
              this.SendErrMsg(event,info + cstrErr + "\n" + "not a same key answer date. ");
            case ERR_GET_STRING_LEN_APP:
                this.SendErrMsg(event,info + cstrErr + "\n" + "length of string is not correct. ");
            case ERR_HASH_INPUT_TOO_LONG:
                this.SendErrMsg(event,info + cstrErr + "\n" + "Hash Data  is too long. ");
            case ERR_HASH_STATE:
                this.SendErrMsg(event,info + cstrErr + "\n" + "Err on hash data. ");
            case ERR_KCC_INI :
                this.SendErrMsg(event,info + cstrErr + "\n" + "Err on  kcc hash ini. ");
            case ERR_KCC_HASH:
                this.SendErrMsg(event,info + cstrErr + "\n" + "Err on  kcc hash data. ");
            case ERR_SIGN_TYPE:
                this.SendErrMsg(event,info + cstrErr + "\n" + " KeyPairs is different with sign. ");
            case ERR_TOKENNAME_EXIST:
                this.SendErrMsg(event,info + cstrErr + "\n" + " Token Name was already exist. ");
            case ERR_PRICE_OVER:
                this.SendErrMsg(event,info + cstrErr + "\n" + " When pay BTC,the price was over max value. ");
            case ERR_NOT_DEC_NUM:
              this.SendErrMsg(event,info + cstrErr + "\n" + " When pay BTC,the price was over max value. ");
            case ERR_ADDR_NOT_MATCH:
              this.SendErrMsg(event,info + cstrErr + "\n" + " BTC Addr. not match. ");
            case NOCHAKEY:
            this.SendErrMsg(event,info + cstrErr + "\n" + " can not open Chakey . ");
            
              default:
                {
                    if( ErrCode != 0 )this.SendErrMsg(event,info + cstrErr);
                }
        }
    }
    else		
    {
        var  AttempTimes=0;
        this.SendErrMsg(event,info + cstrErr + "\n " + "Password was error,please input correct password ,re-try again.");
         // get how many times can be attemp 
          //out param 1 Err,==0 //sucess else error
          //out param 2: return value of Attemp Times 
        AttempTimes=this.ChaKeyGetAttempTimes( )
        if(this.lasterror== 0)
        {
            event.sender.send('Msg', "You can Attemp "+(AttempTimes.toString()) + " times","Tips");
        }

    }
        return ;
}
//////////////////////////  

//new function write at 2018/9/12
//reset Tokens,only test ,later will not be used.
ClearTokens()
{
    return this.SendNoWithData(CLEAR_TOKENS);
}


//return count of Token in ChaKey.
//result:if value >=0, values is the Count of Tokens. If <0,error.
GetTokensCount()
{
    var array_out;
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    
    array_out=this.SendWithData(GET_TOKENS_COUNT, array_in);
    if(this.lasterror!=0){return this.lasterror;}

    return  (array_out[4]) + (array_out[3] << 8) + (array_out[2] << 16) + (array_out[1] << 24); 
}

//AddKeyPairs into ChaKey
//Param1:TokenName
//Param2:KairPair,if is null,generate inside ChaKey
//Param3:SingType ,is BTC sign or Eth sign....
//result: if value=0, success; If <0,error.
AddKeyPairs(TokenName,KairPair,SignType)
{
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var Buf=this.stringToBytes(TokenName);
    var n,i;var tmp;
    for( n = 0 ;n< Buf.length;n++)
    {
        array_in[1 + n] =Buf[n];
    }
    for(n=0;n<16;n++)
    {
        array_in[1 + n + TOKENNAME_LEN]=KairPair.privateKey[31-n];
        array_in[1 + n + TOKENNAME_LEN+16]=KairPair.privateKey[15-n];;
    }
    for(n=0;n<(ECC_LEN+1);n++)
    {
        array_in[1 + n + TOKENNAME_LEN+ECC_LEN] =KairPair.publicKey[n];
    }
    array_in[1 + TOKENNAME_LEN + ECC_LEN*2 + 1]=SignType;
    
    this.SendWithData(ADD_KEYPAIRS, array_in);


    return  this.lasterror; 
}


//list TokensName in ChaKey by index
//Param1:TokensName's Index.
//result: if lasterr==0, return TokensName and Token Type; else reuturn Null,errcode =lasterr.
ListTokensName(Index)
{
    var KeyPairInfo= {
        TokensName : '',
        SignType:BTC_SIGNTYPE,
      };

    var array_out;
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    
    array_in[1] = (Index & 255);
    array_in[2]=  Index >> 8;
    
    array_out=this.SendWithData(LIST_TOKENS_NAME, array_in);
    if(this.lasterror!=0){return "";}
    KeyPairInfo.TokenName=this.Byte2Sting(array_out,1,TOKENNAME_LEN);
    KeyPairInfo.SignType=array_out[1+TOKENNAME_LEN];
    return  KeyPairInfo;
}


//Export PubKey by Index of TokensName.
//Param1:TokensName's Index.
//result: if lasterr==0, return PubKey of TokensName; else reuturn Null,errcode =lasterr.
ExportPubKeyByIndex(Index)
{
    var array_out;
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    
    array_in[1] = (Index & 255);
    array_in[2]=  Index >> 8;
    

    array_out=this.SendWithData(EXP_PUBKEY_BY_INDEX, array_in);
    if(this.lasterror!=0){return undefined;}

    return Buffer.from(array_out.slice(1,34));
}

//Export PubKey by  TokensName.
//Param1:TokensName.
//result: if lasterr==0, return ubKey of TokensName; else reuturn Null,errcode =lasterr.
ExportPubKeyByTokensName(TokensName)
{
    var TokensNameBuf=this.stringToBytes(TokensName);
    var array_out;
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var n;

    for( n = 0 ;n< TokensNameBuf.length;n++)
    {
        array_in[1 + n] = TokensNameBuf[n];
    }

    array_out=this.SendWithData(EXP_PUBKEY_BY_NAME, array_in);
    if(this.lasterror!=0){return undefined;}

    return Buffer.from(array_out.slice(1,34));
}

//chooce a Keypair to perapare to sign
//Param1:TokensName's Index.
//result: if value=0, success; If <0,error.
SelectSignPairsByIndex(Index)
{
    var array_out;
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    
    array_in[1] = (Index & 255);
    array_in[2]=  Index >> 8;
    

    this.SendWithData(SEL_KEYPAIRS_BY_INDEX, array_in);
    return this.lasterror;
}

//chooce a Keypair to perapare to sign
//Param1:TokensName's Index.
//result: if value=0, success; If <0,error.
SelectSignPairsByTokensName(TokensName)
{
    var TokensNameBuf=this.stringToBytes(TokensName);
    var array_out;
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var n;

    for( n = 0 ;n< TokensNameBuf.length;n++)
    {
        array_in[1 + n] = TokensNameBuf[n];
    }

    this.SendWithData(SEL_KEYPAIRS_BY_NAME, array_in);
    return this.lasterror;
}


 ///////////////////// sub funciton hash data on ChaKey 
 Sub_Hash( buf,start,BufLen,cmd)
 {  
         var n;
         var OutData;
         var array_in = new Uint8Array(MAX_TRANSE_LEN) ;

         array_in[1] = BufLen;
 
         for( n = 0 ;n<= BufLen - 1;n++)
         {
             array_in[2 + n] = buf[start+n];
         }
 
         OutData=this.SendWithData(cmd, array_in);
         return OutData;
 
 }

 Sub_Sign(cmd_hash,cmd_sign,buf)
 {
    var pos=0;
    var n,temp;
    var len=buf.length;
    while(len>MAX_SIGN_LEN)
    {
        this.Sub_Hash(buf,pos,MAX_SIGN_LEN,cmd_hash);
        len=len-MAX_SIGN_LEN;
        pos=pos+MAX_SIGN_LEN;
        if(this.lasterror!=0)return this.lasterror;
    }
    this.Sub_Hash(buf,pos,len,cmd_sign);  
    if(this.lasterror!=0)return this.lasterror;
   
    this.bCancelWaitforUserAction=false;

    return this.lasterror;
 }


Hash_SetHashDataOffset(PriceOffset,ToOffset)
{
    BTCHashData.PriceOffset=PriceOffset;
    BTCHashData.ToOffset=ToOffset;
}

Hash_SetHashDataBuf(buf)
{
    BTCHashData.buf=buf;
}

Hash_SetToAddr(Addr)
{
    BTCHashData.Addr=Addr;
}

Hash256_Ini(bShowCursor)
{
    var n;
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var PriceOffset=BTCHashData.PriceOffset;
    var ToOffset=BTCHashData.ToOffset;

    array_in[1]=bShowCursor;

    array_in[2] = (PriceOffset & 255);
    array_in[3]=  PriceOffset >> 8;

    array_in[4] = (ToOffset & 255);
    array_in[5]=  ToOffset >> 8;
    
    var AddrBuf=this.stringToBytes(BTCHashData.Addr);
    for( n = 0 ;n<= AddrBuf.length - 1;n++)
    {
        array_in[6+ n] =AddrBuf[n];
    }
    
    this.SendWithData(HASH256_INI, array_in);
    return this.lasterror;
}

Hash256_Sign()
{
    return this.Sub_Sign(HASH256_BUF,PLAY_SIGN,BTCHashData.buf);
}

Kcc_Ini(bShowCursor)
{
    var array_in = new Uint8Array(MAX_TRANSE_LEN) ;
    var ToOffset=ETHHashData.ToOffset;

    array_in[1]=bShowCursor;

    array_in[2] = (ToOffset & 255);
    array_in[3]=  ToOffset >> 8;

    this.SendWithData(KCC_INI, array_in);
    return this.lasterror;
}


Kcc_Sign()
{
    return this.Sub_Sign(KCC_BUF,KCC_SIGN,ETHHashData.buf);
}

Kcc_SetHashData(HashData)
{
    ETHHashData=HashData;
}

CancelWaitForUserAction(bCancel)
{
    this.bCancelWaitforUserAction=bCancel;
}


}

 //vid,pid
 IChaKey.VID = 0x1995;
 IChaKey.PID = 0x221;
 IChaKey.VID_NEW = 1995;
 IChaKey.PID_NEW= 221;

 //Bnt   
 IChaKey.BNT_LB = 0;
 IChaKey.BNT_RB = 1;
 IChaKey.BNT_LR_B = 2;

 //number   
 IChaKey.NUM_CHAR=0;
 IChaKey.A_M_CHAR=1;
 IChaKey.N_Z_CHAR=2;
     
 //Pay answer data
 IChaKey.CANCEL = 0;
 IChaKey.CONFIRM = 1;
 IChaKey.OVER_TIME_CANCEL=2;

 IChaKey._WAITFOR_USER_ACTION=_WAITFOR_USER_ACTION;

 IChaKey.CHAKEY_PWD_LEN=8;

 IChaKey.SOFTWAVE_VERFCODE_LEN=SOFTWAVE_VERFCODE_LEN;
 IChaKey.ID_LEN=16;

 IChaKey.MAX_TRANSE_LEN= MAX_TRANSE_LEN;

 IChaKey.ERR_OVER_ADDR_STRING_LEN=ERR_OVER_ADDR_STRING_LEN;

 IChaKey.BTC_SIGNTYPE=BTC_SIGNTYPE;

 IChaKey.ETH_SIGNTYPE=ETH_SIGNTYPE;

 IChaKey.ETHHashData=ETHHashData;


 module.exports = IChaKey;



   