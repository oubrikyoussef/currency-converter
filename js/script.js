run();

async function run() {
    const selectElements =  Array.from(document.querySelectorAll('select'));
    const exchangeRate = document.querySelector('.form__exchange-rate');
    const input = document.querySelector('input');

    let fetchedData = JSON.parse(window.localStorage.getItem("fetchedData"));
    await checkLocalSorage();
    const currencies = fetchedData.rates;

    initialize();
    getLastestUpdate();
    calcExchangeRateOnSubmit();
    setFlagOnInput();
    iconsAlternation();
    

    async function checkLocalSorage(){
    if(fetchedData){
        let currentTime = new Date();
        const elapsedTime =  currentTime.getTime(); //Ms Elapsed Since Epoche Time (In Local Time Zone)
        const timezoneOffset = currentTime.getTimezoneOffset()*60*1000;
        currentTime = elapsedTime - timezoneOffset;
        const lastestUpdate = new Date(fetchedData.date).getTime();
        const dayInMs = 86400000;

        if(currentTime - lastestUpdate >= dayInMs){
            fetchedData = await fetchData("0c0dd52befec42fa8223a44d63ebb1ba", "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=");
        }
    }
    else {
        fetchedData = await fetchData("0c0dd52befec42fa8223a44d63ebb1ba", "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=");
    }

    }
    async function initialize(){
    for(let i = 0 ; i < selectElements.length ; i++){
            for(currency in country_list){
                const option = document.createElement('option');
                option.innerText = currency;
                selectElements[i].append(option);
                if(i===0 && currency === "USD"){
                    const countryName = country_list[currency].toLowerCase();
                    selectElements[i].previousElementSibling.src = `https://flagcdn.com/w20/${countryName}.png`;
                    const selected = document.createAttribute("selected");
                    option.setAttributeNode(selected);
                }
                if(i===1 && currency === "MAD"){
                    const countryName = country_list[currency].toLowerCase();
                    selectElements[i].previousElementSibling.src = `https://flagcdn.com/w20/${countryName}.png`;
                    const selected = document.createAttribute("selected");
                    option.setAttributeNode(selected);
                }
                
            }
        }

    }
    function getLastestUpdate(){
        const date = document.querySelector('.form__latest-update span');
        const time = fetchedData.date.split(" ")[1];
        const day = fetchedData.date.split(" ")[0];
        date.innerText = day + " at " + time;
        
    }
    function calcExchangeRateOnSubmit(){
        const form = document.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            calcExchangeRate();
            
        });
    }
    function setFlagOnInput(){
        selectElements.forEach((selectElement)=>selectElement.addEventListener("input",()=>{getFlags(selectElement)})
        )
    }
    function iconsAlternation(){
        const alternateIcon = document.querySelector('i');
        alternateIcon.addEventListener("click",()=>{
            [selectElements[0].value,selectElements[1].value]  = [selectElements[1].value,selectElements[0].value];
            
            selectElements.forEach((selectElement)=>{
                getFlags(selectElement);
            })
        })
    }
    function calcExchangeRate(){
        let amount = input.value.trim();
        if(!isNaN(+amount)){
            amount = amount !== "" ? +amount : 1 ;
            const fromCurrency = selectElements[0].value;
            const toCurrency = selectElements[1].value;
            const fromValue = currencies[fromCurrency];
            const toValue = currencies[toCurrency];
            const converted = (toValue / fromValue) * amount;
            exchangeRate.innerText = `${amount} ${fromCurrency} = ${converted !== 0 ?converted.toFixed(5) : converted} ${toCurrency}`;
        }
        else{
            exchangeRate.innerText = `Please Enter A Valid Number Non Negative Number`;
        }
        
    }
    function getFlags(selectElement){  
        const countryName = country_list[selectElement.value].toLowerCase();
        const img = selectElement.previousElementSibling;
        img.src = `https://flagcdn.com/w20/${countryName}.png`;
        calcExchangeRate();
    }
    async  function fetchData(apiKey,apiUrl){
        try{
        exchangeRate.innerText = `Loading Data ...`;
        const response = await fetch(apiUrl + apiKey);
        const fetchedData = await response.json();
        window.localStorage.setItem("fetchedData",JSON.stringify(fetchedData));
        exchangeRate.innerText = `Here you'll be able to see exchange rate`
        return fetchedData;
        }
        catch(error){
            console.error(`Failed because of ${error} , Please try again later`);
        }
    }
}


