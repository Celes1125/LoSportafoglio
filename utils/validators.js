module.exports={
    isGoodPassword:(value)=>{
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/;
        return regex.test(value);
    },
    phoneValidate:(input) => {
        const telefono = input.replace(/\D/g, "");
        return /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/.test(telefono);
    },
    emailValidate:(input) => {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(input);
      }, 
    isValidName : (input) => {
        const regex = /^[a-zA-Z ]+$/;
        return input.length >= 4 && regex.test(input);
      }    
      
}