var specialitesJSON = '[{ "id": 1, "nom": "Médecin généraliste" }, { "id": 2, "nom": "Dentiste" }, { "id": 3, "nom": "Cardiologue" },{ "id": 4, "nom": "Dermatologue" },{ "id": 5, "nom": "Ophtalmologue" }]';
let rendezVous = [];
function objSelect(id){
    return document.getElementById(id);
}
const oNom    = objSelect("txtNom");
const oTel    = objSelect("txtTel");
const oSpec   = objSelect("sltSpecialite");
const oDate   = objSelect("txtDate");
const oSearch = objSelect("txtChercher");
const tableRdv = objSelect("table_rdv");

function remplirSpecialites(){
    let specs = JSON.parse(specialitesJSON);   
    for(let i = 0; i < specs.length; i++){
        let option = document.createElement("option");
        option.value = specs[i].nom;        
        option.textContent = specs[i].nom;  
        oSpec.appendChild(option);
    }
}

document.addEventListener("DOMContentLoaded", function(){
    remplirSpecialites();   
    afficher();             
});

objSelect("btn_ajouter").addEventListener("click", ajouter_rdv);

oSearch.addEventListener("input", function(){
    afficher();
});
class RendezVous {
    constructor(nom, telephone, date, specialite){
        this.nom        = nom;
        this.telephone  = telephone;
        this.date       = date;
        this.specialite = specialite;
    }
    estValide(){
     
        if(this.nom.trim() === "" || this.telephone.trim() === "" ||
           this.date === "" || this.specialite === ""){
            return false;
        }
        let chiffres = this.telephone.replace(/\D/g, "");
        if(chiffres.length < 8){
            return false;
        }
        let dateRdv = new Date(this.date);
        let aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0);
        if(dateRdv < aujourdhui){
            return false;
        }

        return true;
    }
    toHTML(){
        return `<tr>
                    <td>${this.nom}</td>
                    <td>${this.telephone}</td>
                    <td>${this.specialite}</td>
                    <td>${this.date}</td>
                    <td>
                        <button class="btn-delete"
                            onclick="supprimer_rdv('${this.telephone}')">
                            Supprimer
                        </button>
                    </td>
                </tr>`;
    }
}
function hideErrors(){
    objSelect("errNom").style.display  = "none";
    objSelect("errTel").style.display  = "none";
    objSelect("errSpec").style.display = "none";
    objSelect("errDate").style.display = "none";
}

function validation(){
    hideErrors();
    let isValid = true;
    if(oNom.value.trim() === ""){
        objSelect("errNom").style.display = "block";
        isValid = false;
    }
    let chiffres = oTel.value.replace(/\D/g, "");
    if(chiffres.length < 8){
        objSelect("errTel").style.display = "block";
        isValid = false;
    }

    if(oSpec.value === ""){
        objSelect("errSpec").style.display = "block";
        isValid = false;
    }

    if(oDate.value === ""){
        objSelect("errDate").style.display = "block";
        isValid = false;
    } else {
        let dateRdv = new Date(oDate.value);
        let aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0);
        if(dateRdv < aujourdhui){
            objSelect("errDate").style.display = "block";
            isValid = false;
        }
    }

    return isValid;
}

function ajouter_rdv(){

    let nom        = oNom.value;
    let telephone  = oTel.value;
    let date       = oDate.value;
    let specialite = oSpec.value;


    if(!validation()) return;
    let nouveauRdv = new RendezVous(nom, telephone, date, specialite);
    if(!nouveauRdv.estValide()){
        alert("Veuillez remplir correctement tous les champs.");
        return;
    }
    rendezVous.push(nouveauRdv);
    afficher();
    oNom.value  = "";
    oTel.value  = "";
    oDate.value = "";
    oSpec.value = "";
}

function afficher(){
    let content = "";
    let motCle = oSearch.value.toLowerCase();

    let liste = rendezVous.filter(function(item){
        return item.nom.toLowerCase().includes(motCle) ||
               item.specialite.toLowerCase().includes(motCle);
    });

    if(liste.length === 0){
        content = `<tr><td colspan="5" class="empty-msg">Aucun rendez-vous trouvé.</td></tr>`;
    } else {
        for(let i = 0; i < liste.length; i++){
            content += liste[i].toHTML();
        }
    }

    objSelect("tdata").innerHTML = content;

    for(let i = 0; i < tableRdv.rows.length - 1; i++){
        tableRdv.rows[i + 1].addEventListener("click", function(e){
            for(let j = 1; j < tableRdv.rows.length; j++){
                tableRdv.rows[j].classList.remove("row-selected");
            }
            e.currentTarget.classList.add("row-selected");
        });
    }
}

function supprimer_rdv(telephone){
    if(confirm("Voulez-vous supprimer ce rendez-vous ?") == true){
        let vIndex = rendezVous.findIndex(function(item){
            return item.telephone == telephone;
        });

        if(vIndex !== -1){
            rendezVous.splice(vIndex, 1);
            afficher();
        }
    }
}