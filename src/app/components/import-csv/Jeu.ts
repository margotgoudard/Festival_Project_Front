export class JeuCsv {
    public NomDuJeu : string;
    public Auteur : string;
    public Éditeur : string;
    public Exposant : string;
    public nbJoueurs : string;	
    public checkboxJoueurs : string;
    public âgeMin : string;
    public checkboxAge : string;	
    public Durée : string;
    public checkboxDurée : string;
    public Type : string;
    public PAvantPremière : string;
    public Notice : string;
    public ZonePlan : string;
    public ZoneBenevole : string;
    public Présent : boolean;
    public ÀAnimer : boolean;	
    public Reçu : boolean;	
    public Mécanismes : string;
    public Thèmes : string;
    public Tags : string;
    public Description : string;
    public Image : string;
    public Logo : string;
    public Vidéo: string;
     
    constructor(
        NomDuJeu : string,
        Auteur : string,
        Éditeur : string,
        Exposant : string,
        nbJoueurs : string,	
        checkboxJoueurs : string,
        âgeMin : string,
        checkboxAge : string,	
        Durée : string,
        checkboxDurée : string,
        Type : string,
        PAvantPremière : string,
        Notice : string,
        ZonePlan : string,
        ZoneBenevole : string,
        Présent : string,
        ÀAnimer : string,	
        Reçu : string,	
        Mécanismes : string,
        Thèmes : string,
        Tags : string,
        Description : string,
        Image : string,
        Logo : string,
        Vidéo: string
    ) {
        this.NomDuJeu = NomDuJeu;
        this.Auteur = Auteur;
        this.Éditeur = Éditeur;
        this.Exposant = Exposant;
        this.nbJoueurs = nbJoueurs;	
        this.checkboxJoueurs = checkboxJoueurs;
        this.âgeMin = âgeMin;
        this.checkboxAge = checkboxAge;	
        this.Durée = Durée;
        this.checkboxDurée = checkboxDurée;
        this.Type = Type;
        this.PAvantPremière = PAvantPremière;
        this.Notice = Notice;
        this.ZonePlan = ZonePlan;
        this.ZoneBenevole = ZoneBenevole;
        this.Présent = (Présent == 'oui') ? true : false;
        this.ÀAnimer = (ÀAnimer == 'oui') ? true : false;	
        this.Reçu =  ( Reçu == 'oui') ? true : false;	
        this.Mécanismes = Mécanismes;
        this.Thèmes = Thèmes;
        this.Tags = Tags;
        this.Description = Description;
        this.Image = Image;
        this.Logo = Logo;
        this.Vidéo = Vidéo;
    }

}