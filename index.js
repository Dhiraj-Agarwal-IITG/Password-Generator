const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-passwordLength]");
const passwordDisplay = document.querySelector("[data-displayPassword]");
const copyMsg= document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copyBtn]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generate-button");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 1;
let symbolString = '`~!@#$%^&*()_+-;:"?/>.<,|\{}[]';
uppercaseCheck.checked = true;
handleSlider();
setIndicator("#ccc")
//set strength cirle color


//Set passwordLength
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ;
}

function getRandomInteger(min,max)
{
   return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
    return getRandomInteger(0,9);
}

function generateLowerCase()
{
    return String.fromCharCode(getRandomInteger(97,122));
}

function generateUpperCase()
{
    return String.fromCharCode(getRandomInteger(65,90));
}

function generateSymbol()
{
    let index = getRandomInteger(0,symbolString.length);
    return symbolString.charAt(index);
}

function calculateStrength()
{
    let hasUpper = true;
    let hasLower = false;
    let hasNum = false;  
    let hasSym =  false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }

    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }

    else
    {
        setIndicator("#f00");
    }
}

async function copyContent()
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e)
    {
        copyMsg.innerText = "Failed";
    }

    //Copy Visible
    copyMsg.classList.add("active");

    setTimeout(()=>{ copyMsg.classList.remove("active")},2000); 
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',(e)=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach((checkBox)=>
    {
        if(checkBox.checked)
        checkCount++;
    });

    if(checkCount>passwordLength)
    {
        passwordLength = checkCount;
        handleSlider();
    }

}

allCheckBox.forEach( (checkBox)=>{
    checkBox.addEventListener('change',handleCheckBoxChange);
})

generateBtn.addEventListener('click',()=>{
    //none of the checkBox are checked
    if(checkCount<=0) return;

    if(passwordLength<checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let arr = [];

    if(uppercaseCheck.checked)
    {
        arr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked)
    {
        arr.push(generateLowerCase);
    }

    if(numbersCheck.checked)
    {
        arr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked)
    {
        arr.push(generateSymbol);
    }

    //compulsory Addition
    for(let i = 0;i<arr.length;i++)
    {
        password +=arr[i]();
    }

    //remaining addition

    for(let i = 0;i<passwordLength-arr.length;i++)
    {
        let randomIndex = getRandomInteger(0,arr.length);
        password +=arr[randomIndex]();
    }

    //shuffle the password

    password = shufflePassword(Array.from(password));

    //Password in UI
    passwordDisplay.value = password;

    //calc strength
    calculateStrength();

})

function shufflePassword(arr)
{
    //Fisher Yates method
    for(let i = arr.length-1;i>0;i--)
    {
        const j = Math.floor(Math.random()*(i+1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    let str = "";
    arr.forEach((el)=>(str+=el));
    return str;
}