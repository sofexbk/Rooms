import axios from 'axios';


const translateMessage = async (text: string, from: string, to: string) => {
    const options = {
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        params: {
          text: text,
          to: to,
          from: from
        },
        headers: {
            'X-RapidAPI-Key': '132de27cb4mshe127f6a5e0a90fep1f54edjsn0b218fc11a0b',
            'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
          }
      };
    const response = await axios.request(options);
    return response.data;
    };
export default translateMessage;