const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });
    console.log("\n🎉 Connexion au modèle 'gemini-1.5-flash' établie avec succès ! ✅");
   
    
    return model;
};

getModel();

module.exports = { getModel };