


const validarCampos=(campos)=>{
    let reglas=[]
    for(const key in campos){
        reglas=[...reglas,...campos[key]];

    }
    return reglas;
}

module.exports=validarCampos;