
const express = require('express');
const { getDocumentContnet, exportAsPdf } = require('./googleapis/google-drive');
const { getGoogleAuthLink, getGoogleCode, handleGoogleResponse } = require('./googleapis/auth');
const app = express();

const fs = require('fs');


const PORT = process.env.PORT;

app.set('view engine', 'ejs');


app.get('/', async (req, res, next) => {
    try{
        let google_auth_link = getGoogleAuthLink();
        let code = getGoogleCode();
        res.render('index.ejs', {
            google_auth_link,
            code
        });
    } catch(e){
        next(e);
    }
});

app.get('/google-callback', (req, res, next) => {
    handleGoogleResponse(req.query);
    res.redirect('/');
})

app.get('/doc-data', async (req, res, next) => {
    try{
        let data = await getDocumentContnet(process.env.GDOC_FILE_ID);
        res.send(data);
    }catch(e){
        next(e);
    }
});

app.get('/to-pdf', async (req, res, next) => {
    try{
        let file = await exportAsPdf(process.env.GDOC_FILE_ID);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="document.pdf"`
          });
        
        res.send(file);
    }catch(e){
        next(e);
    }
})



app.use((err, req, res, next) => {
    res.status(500).send(`Something went wrong ${err.message}`);
})


app.listen(PORT, () => {
    console.log(`Server is lisening on port ${PORT}`);
});