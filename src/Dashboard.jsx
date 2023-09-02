import React, { useState, useEffect, useRef} from "react"

import useAuth from "./hooks/useAuth"
import './styles/extraStyles.css'
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import Card from "react-bootstrap/Card"
import 'bootstrap/dist/css/bootstrap.css';
import {
  DashBoardContainer,
  SearchInput,
  ResultsContainer,
  LyricsContainer,
  PlayerContainer,
  SelectButton,
  Container,
  TopContainer,
  LoadingWord,
  TitleDiv,
  ColorTitleDiv,
  ColorButton,
  TopDiv
} from "./styles/Dashboard.styles"
import ReactWordcloud from 'react-wordcloud';
import ProgressBar from "@ramonak/react-progress-bar";
import Select from 'react-select';
import Checkbox from "react-custom-checkbox";
import * as Icon from "react-icons/fi";
import { SwatchesPicker } from 'react-color';
import DomToImage from "dom-to-image"
import complementaryColors from "complementary-colors"

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
})

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code)
  const [words, setWords] = useState([]);
  const [songsGrabbed, setSongsGrabbed] = useState(0);
  const [timeLength, setTimeLength] = useState("long_term");
  const [isLoading, setIsLoading] = useState(false);
  const [useExplicitWords, setUseExplicitWords] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [finishWords, setFinishWords] = useState(false);
  const [topArtists, setTopArtists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [button1Color, setButton1Color] = useState("#808080");
  const [button2Color, setButton2Color] = useState("#808080");
  const [button3Color, setButton3Color] = useState("#808080");
  const [button4Color, setButton4Color] = useState("#808080");
  const [button5Color, setButton5Color] = useState("#808080");
  const [button6Color, setButton6Color] = useState("#808080");
  const [button7Color, setButton7Color] = useState("#808080");
  const [colorList, setColorList] = useState([]);
  const [bannerColor, setBannerColor] = useState("black");
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentButton, setCurrentButton] = useState(0);
  const [avgPop, setAvgPop] = useState(0);
  const [avgEnergy, setAvgEnergy] = useState(0);
  const [avgDance, setAvgDance] = useState(0);
  const [avgValence, setAvgValence ] = useState(0);
  const [options, setOptions] = useState({
    fontSizes: [5,28],
    colors: ["#808080"],
    svgAttributes: {backgroundColor: "#1db954"}
  });
  const [modifiedCloud, setModifiedCloud] = useState(null);
  const [svgGenerated, setSvgGenerated] = useState(false);
  const [username, setUsername] = useState("");

  function resetState(){
    setWords([]);
    setSongsGrabbed(0);
    setTimeLength("long_term");
    setIsLoading(false);
    setUseExplicitWords(false);
    setShowColorPicker(false);
    setFinishWords(false);
    setButton1Color("#808080");
    setButton2Color("#808080");
    setButton3Color("#808080");
    setButton4Color("#808080");
    setButton5Color("#808080");
    setButton6Color("#808080");
    setButton7Color("#808080");
    setCurrentButton(0);
    setIsDisabled(false);
    setOptions({
      fontSizes: [5,10],
      colors: ["#808080"],
      svgAttributes: {backgroundColor: "#1db954"}
    })
  }

  const size = [350, 350];

  let stopwords = ["about","above","abroad","according","accordingly","across","actually","adj","after","afterwards",
  "against","ago","ahead","ain't","all","allow","allows","almost","along","alongside","already","also","although","always",
  "am","amid","amidst","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","appropriate","are","aren't","around","as","a's","aside",
  "at","away","awfully","back","backward","backwards","be","became","because","become","becomes","becoming","been",
  "before","below","beside","besides","best","better","between","beyond","both",
  "but","by","came","can","cannot","cant","can't","cause","causes","certainly","changes","clearly",
  "c'mon","co","co.","com","contain","containing",
  "corresponding","could","couldn't","course","c's","currently","daren't","definitely","described","despite","did","didn't",
  "different","directly","do","does","doesn't","doing","done","don't","down","downwards","during","each","edu","eg",
  "either","else","elsewhere","ending","entirely","especially","et","etc","even","ever","evermore","every",
  "ex","exactly","example","except","fairly","farther","for","former","formerly","forth","from","further","furthermore",
  "get","gets","getting","given","gives","go","goes","going","got","gotten","had","hadn't","half","happens",
  "hardly","has","hasn't","have","haven't","having","he","he'd","he'll","help","hence","her","here","hereafter","hereby",
  "herein","here's","hereupon","hers","herself","he's","hi","him","himself","his","hither","hopefully","how","howbeit","however",
  "i'd","ie","if","i'll","i'm","immediate","in","inasmuch","inc","inc.",
  "indicates","inner","inside","insofar","instead","into","inward","is","isn't","it","it'd","it'll","its","it's","itself","i've",
  "just","k","keep","keeps","kept","know","known","knows","last","lately","later","latter","latterly","least","less","lest","let",
  "let's","like","liked","likely","likewise","look","looking","looks","low","lower","ltd","made","mainly","make","makes",
  "many","may","maybe","mayn't","me","meantime","meanwhile","merely","might","mightn't","mine","moreover",
  "most","mostly","mr","mrs","much","must","mustn't","my","myself","nd","near","nearly","needn't",
  "needs","neither","never","neverf","neverless","nevertheless","new","next","no","non","none","nonetheless",
  "noone","no-one","nor","normally","not","notwithstanding","of","off","often","oh","ok","ohh",
  "okay","old","on","once","one","ones","one's","only","onto","or","other","others","otherwise","ought","oughtn't","our",
  "ours","ourselves","out","outside","over","overall","own","particular","particularly","past","per","perhaps","placed","please",
  "plus","possible","presumably","probably","provided","provides","que","quite","qv","rather","rd","re","really","reasonably","recent",
  "recently","regarding","regardless","regards","relatively","respectively","right","round","said","same","saw","say","saying",
  "says","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious",
  "shall","shan't","she","she'd","she'll","she's","should","shouldn't","since","so","some",
  "somebody","someday","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified",
  "specify","specifying","still","sub","such","sup","sure","take","taken","taking","tends","th","than",
  "thanx","that","that'll","thats","that's","that've","the","their","theirs","them","themselves","then","thence","there","thereafter",
  "thereby","there'd","therefore","therein","there'll","there're","theres","there's","thereupon","there've","these","they","they'd",
  "they'll","they're","they've","thing","things","think","third","thirty","this","thorough","thoroughly","those","though","three",
  "through","throughout","thru","thus","till","to","together","too","took","toward","towards",
  "t's","two","un","under","underneath","undoing","unfortunately","unless","unlike","unlikely","until","unto","up","upon",
  "upwards","us","use","used","useful","uses","using","usually","v","value","various","very","via","viz","vs","want","wants",
  "was","wasn't","way","we","we'd","welcome","well","we'll","went","were","we're","weren't","we've","what","whatever","what'll",
  "what's","what've","when","whence","whenever","where","whereafter","whereas","whereby","wherein","where's","whereupon",
  "whether","which","whichever","while","whilst","whither","who","who'd","whoever","who'll","whom","whomever","who's",
  "whose","why","will","with","within","without","wonder","won't","would","wouldn't","yes","yet","you","you'd","ohh",
  "you'll","your","you're","yours","yourself","yourselves","you've","a","how's","i","when's","why's","b","c","d","e","f",
  "g","h","j","l","m","n","o","p","q","r","s","t","u","uucp","w","x","y","z","I","www","i'll","i'm","ain't","l'm","je","eu",
  "con","couldnt","de","ti","ho","en","ha","vho","mu","te","ka","es","σ'","ft","yo","leo","ci","ap'","tú","wa","don’t","dat",
  "full","give","hasnt","herse","himse","itse”","myse”","part","put","side","vhu","mo","omo","-","i’m","–","em","you’re","eh",
  "top","abst","accordance","affecting","ke","kha","su","se","lei","tha","che","io","hu","ma","il","una","ain’t","i’ll","é",
  "affects","ah","announce","anymore","apparently","approximately","aren","arent","arise","auth","beginning","beginnings","è","di",
  "begins","biol","briefly","ca","date","ed","effect","et-al","ff","fix","gave","giving","heres","hes","hid","home","id","im","da",
  "immediately","importance","important","index","information","invention","itd","keys","kg","km","largely","lets","line","le","lo",
  "'ll","means","mg","ml","mug","na","nay","necessarily","nos","noted","obtain","obtained","omitted","ord","owing","si", "mi","la", 
  "poorly","possibly","potentially","pp","predominantly","present","previously","primarily","promptly","wanna","gonna","tshikwama",
  "quickly","readily","ref","refs","related","research","resulted","resulting","results","run","sec","section","shed","vhaḓe","limpopo",
  "shes","showed","shown","showns","shows","significant","significantly","similar","similarly","slightly","somethan","na","norah",
  "specifically","strongly","substantially","successfully","sufficiently","thered","ya","vashti","radiohead","outkast","var","nah","no","nope",
  "thereof","therere","thereto","theyd","theyre","thou","thoughh","throug","til","tip","ts","ups","usefully","hey","bunyan","yea","yes",
  "usefulness","'ve","vol","vols","wed","whats","wheres","whim","whod","whos","widely","words","youd","youre", "", ">", "-","›","yeah",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "lyrics", "lyric","album","song",
  "ένα","έναν","ένας","αι","ακομα","ακομη","ακριβως","αλλα","αλλαχου","αλλες","αλλη"," αλλην","αλλης","αλλιως","αλλιωτικα","αλλο","αλλοι","αλλοιως","αλλοιωτικα","αλλον","αλλος","αλλοτε","αλλου"," αλλους","αλλων","αμα","αμεσα","αμεσως","αν","ανα","αναμεσα","αναμεταξυ","ανευ","αντι"," αντιπερα","αντις","ανω","ανωτερω","αξαφνα","απ","απο","αποψε","από","αρα","αραγε","αργα"," αργοτερο","αρκετα","αρχικα","ας","αυτα","αυτες","αυτεσ","αυτη","αυτην", "αυτης","αυτο","αυτοι","αυτον","αυτος","αυτοσ","αυτου","αυτους","αυτουσ","αυτων"," αφοτου","αφου","αἱ","αἳ","αἵ","αὐτόσ","αὐτὸς","αὖ","α∆ιακοπα","βεβαια","βεβαιοτατα","γάρ","γα","γα^","γε","γι"," για","γοῦν","","γυρω","γὰρ","δ'","δέ","δή","δαί","δαίσ","δαὶ","δαὶς","δε","δεν","δι","δι'","διά","δια","διὰ"," δὲ","δὴ","δ’","εαν","εαυτο","εαυτον","εαυτου","εαυτους","εαυτων","εγκαιρα","εγκαιρως"," εγω","ειθε","ειμαι","ειμαστε","ειναι","εις","εισαι","εισαστε","ειστε","ειτε","ειχα","ειχαμε","ειχαν","ειχατε"," ειχε","ειχες","ει∆εμη","εκ","εκαστα","εκαστες","εκαστη","εκαστην","εκαστης","εκαστο"," εκαστοι","εκαστον","εκαστος","εκαστου","εκαστους","εκαστων","εκει","εκεινα","εκεινες"," εκεινεσ","εκεινη","εκεινην","εκεινης","εκεινο","εκεινοι","εκεινον","εκεινος","εκεινοσ"," εκεινου","εκεινους","εκεινουσ","εκεινων","εκτος","εμας","εμεις","εμενα","εμπρος","εν"," ενα","εναν","ενας","ενος","εντελως","εντος","εντωμεταξυ","ενω","ενός","εξ","εξαφνα"," εξης","εξισου","εξω","επ","επί","επανω","επειτα","επει∆η","επι","επισης","επομενως"," εσας","εσεις","εσενα","εστω","εσυ","ετερα","ετεραι","ετερας","ετερες","ετερη","ετερης"," ετερο","ετεροι","ετερον","ετερος","ετερου","ετερους","ετερων","ετουτα","ετουτες","ετουτη","ετουτην","ετουτης"," ετουτο","ετουτοι","ετουτον","ετουτος","ετουτου","ετουτους","ετουτων","ετσι","ευγε","ευθυς","ευτυχως","εφεξης"," εχει","εχεις","εχετε","εχθες","εχομε","εχουμε","εχουν","εχτες","εχω","εως","εἰ","εἰμί","εἰμὶ","εἰς","εἰσ","εἴ"," εἴμι","εἴτε","ε∆ω","η","ημασταν","ημαστε","ημουν","ησασταν","ησαστε","ησουν","ηταν","ητανε","ητοι","ηττον"," η∆η","θα","ι","ιι","ιιι","ισαμε","ισια","ισως","ισωσ","ι∆ια","ι∆ιαν","ι∆ιας","ι∆ιες","ι∆ιο","ι∆ιοι","ι∆ιον","ι∆ιος","ι∆ιου","ι∆ιους","ι∆ιων","ι∆ιως","κ","καί","καίτοι","καθ","καθε","καθεμια","καθεμιας"," καθενα","καθενας","καθενος","καθετι","καθολου","καθως","και","κακα","κακως","καλα"," καλως","καμια","καμιαν","καμιας","καμποσα","καμποσες","καμποση","καμποσην","καμποσης","καμποσο","καμποσοι","καμποσον","καμποσος","καμποσου","καμποσους","καμποσων","κανεις","κανεν"," κανενα","κανεναν","ελα","κανενος","καποια","καποιαν","καποιας","καποιες","καποιο"," καποιοι","καποιον","καποιος","καποιου","καποιους","καποιων","καποτε","καπου","καπως","κατ","κατά","κατα","κατι","κατιτι","κατοπιν","κατω","κατὰ","καὶ","κι","κιολας","κλπ","κοντα"," κτλ","κυριως","κἀν","κἂν","λιγακι","λιγο","λιγωτερο","λογω","λοιπα","λοιπον","μέν"," μέσα","μή","μήτε","μία","μα","μαζι","μακρυα","μαλιστα","μαλλον","μας","με","μεθ","εγώ","μειον"," μελει","μελλεται","μεμιας","μεν","μερικα","μερικες","μερικοι","μερικους","μερικων","μεσα","μετ","μετά","μετα"," μεταξυ","μετὰ","μεχρι","μη","μην","μηπως","μητε","μη∆ε","μιά","μια","μιαν","μιας","μολις","μολονοτι","μοναχα"," μονες","μονη","μονην","μονης","μονο","μονοι","μονομιας","μονος","μονου","μονους","μονων","μου"," μπορουν","μπραβο","μπρος","μἐν","μὲν","μὴ","μὴν","να","ναι","νωρις","ξανα","ξαφνικα", "ο","οι","ολα","ολες","ολη","ολην","ολης","ολο","ολογυρα","ολοι","ολον","ολονεν","ολος"," ολοτελα","ολου","ολους","ολων","ολως","ολως∆ιολου","ομως","ομωσ","οποια","οποιαν"," οποιαν∆ηποτε","οποιας","οποιας∆ηποτε","οποια∆ηποτε","οποιες","οποιες∆ηποτε","οποιο" ,"οποιοι","οποιον","οποιον∆ηποτε","οποιος","οποιος∆ηποτε","οποιου","οποιους","οποιους∆ ηποτε","οποιου∆ηποτε","οποιο∆ηποτε","οποιων","οποιων∆ηποτε","οποι∆ηποτε","οποτε","οποτε∆ ηποτε","οπου","οπου∆ηποτε","οπως","οπωσ","ορισμενα","ορισμενες","ορισμενων"," ορισμενως","οσα","οσα∆ηποτε","οσες","οσες∆ηποτε","οση","οσην","οσην∆ηποτε","οσης"," οσης∆ηποτε","οση∆ηποτε","οσο","οσοι","οσοι∆ηποτε","οσον","οσον∆ηποτε","οσος","οσος∆ ηποτε","οσου","οσους","οσους∆ηποτε","οσου∆ηποτε","οσο∆ηποτε","οσων","οσων∆ηποτε","οταν","οτι","οτι∆ηποτε","οτου","ου","ουτε","ου∆ε","οχι","οἱ","οἳ","οἷς","οὐ","οὐδ","οὐδέ","οὐδείσ","οὐδεὶς","οὐδὲ","οὐδὲν","οὐκ","οὐχ","οὐχὶ","οὓς","οὔτε","οὕτω","οὕτως","οὕτωσ","οὖν","οὗ","οὗτος","οὗτοσ","παλι","εγώ"," παντου","παντως","παρ","παρά","παρα","παρὰ","περί","περα","περι","περιπου","περσι","περυσι","περὶ","πια","πιθανον","πιο","πισω","πλαι","πλεον","πλην","ποια","ποιαν","ποιας","ποιες","ποιεσ","ποιο","ποιοι","ποιον","ποιος","ποιοσ","ποιου","ποιους"," ποιουσ","ποιων","πολυ","ποσες","ποση","ποσην","ποσης","ποσοι","ποσος","ποσους","ποτε","που","πουθε","είναι","ποῦ","πρεπει","πριν","προ","προκειμενου","προκειται","απ’","προς","προσ"," προτου","προχθες","προχτες","πρωτυτερα","πρόσ","πρὸ","πρὸς","πως","πωσ","σαν","σας","σε","σεις","αυτό","σιγα","σου","στα","στη","στην","στης","στις","στο","στον","στου","στους","στων","όπως"," συν","συναμα","συνεπως","συνηθως","συχνα","συχνας","συχνες","συχνη","συχνην"," συχνης","συχνο","συχνοι","συχνον","συχνος","συχνου","συχνους","συχνων","συχνως"," σχε∆ον","σωστα","σόσ","σύ","σύν","σὸς","σὺ","σὺν","τά","τήν","τί","τίς","τίσ","τα","ταυτα","ταυτες","ταυτη"," ταυτην","ταυτης","ταυτο,ταυτον","ταυτος","ταυτου","ταυτων","ταχα","ταχατε","ταῖς","τα∆ε","τε","τελικα"," τελικως","τες","τετοια","τετοιαν","τετοιας","τετοιες","τετοιο","τετοιοι","τετοιον","τετοιος","τετοιου","τετοιους", "τετοιων","τη","την","της","τησ","τι","τινα","τιποτα","τιποτε","τις","τισ","το","τοί","τοι","τοιοῦτος","τοιοῦτοσ"," τον","τος","τοσα","τοσες","τοση","τοσην","τοσης","τοσο","τοσοι","τοσον","τοσος","τοσου","τοσους","τοσων","τοτε","του","τουλαχιστο","έλα","τους","τουτα","τουτες","τουτη" ,"τουτην","τουτης","τουτο","τουτοι","τουτοις","τουτον","τουτος","τουτου","τουτους"," τουτων","τούσ","τοὺς","τοῖς","τοῦ","τυχον","των","τωρα","τό","τόν","τότε","τὰ","τὰς","τὴν" ,"τὸ","τὸν","τῆς","τῆσ","τῇ","τῶν","τῷ","υπ","υπερ","υπο","υποψη","υποψιν","υπό","υστερα","φετος","χθες","χτες","χωρις","χωριστα","ω","ωραια","ως","ωσ","ωσαν","ωσοτου","ωσπου","ωστε","ωστοσο","ωχ","ἀλλ'","ἀλλά","ἀλλὰ","ἀλλ’","ἀπ","ἀπό","ἀπὸ", "ἀφ","ἂν","ἃ","ἄλλος","ἄλλοσ","ἄν","ἄρα","ἅμα","ἐάν","ἐγώ","ἐγὼ","ἐκ","ἐμόσ","ἐμὸς","ἐν"," ἐξ","ἐπί","ἐπεὶ","ἐπὶ","ἐστι","ἐφ","ἐὰν","ἑαυτοῦ","ἔτι","ἡ","ἢ","ἣ","ἤ","ἥ","ἧς","ἵνα","ὁ","ὃ","ὃν","ὃς","ὅ","ὅδε"," ὅθεν","ὅπερ","ὅς","ὅσ","ὅστις","ὅστισ","ὅτε","ὅτι","ὑμόσ","ὑπ","ὑπέρ","ὑπό","ὑπὲρ","ὑπὸ", "ὡς","ὡσ","ὥς","ὥστε","ὦ","ᾧ","∆α","∆ε","∆εινα","∆εν","∆εξια","∆ηθεν","∆ηλα∆η","∆ι","∆ ια","∆ιαρκως","∆ικα","∆ικο","∆ικοι","∆ικος","∆ικου","∆ικους","∆ιολου","∆ιχως"];

  let explicitWords = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", 
  "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", 
  "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", 
  "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", 
  "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", 
  "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", 
  "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", 
  "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", 
  "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", 
  "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", 
  "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", 
  "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", 
  "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", 
  "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", 
  "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", 
  "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", 
  "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", 
  "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", 
  "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "god-dam", 
  "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", 
  "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", 
  "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", 
  "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", 
  "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", 
  "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", 
  "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", 
  "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", 
  "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", 
  "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", 
  "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", 
  "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", 
  "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", 
  "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", 
  "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", 
  "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", 
  "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", 
  "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", 
  "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", 
  "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", 
  "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "fuckin'"];

  const selectChoices = [
    { value: 'short_term', label: 'Last Month' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' },
  ];

  function selectHandleChange(timeLengthPar){
    setTimeLength(timeLengthPar);
  }

  function wordFreq(string) {
    var words = string.replace(/[.]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function(w) {
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    return freqMap;
  }

  function trimList(wordArray){
    let trimArray = wordArray.slice(-75);
    return trimArray
  }

  function switchExplicit(){
    setUseExplicitWords(!useExplicitWords);
    console.log(useExplicitWords);
  }

  function getLists(){
    let trackNameList = [];
    let artistNameList = [];
    let trackIdList = [];
    let popularityList = [];
    spotifyApi.getMyTopTracks({limit: 50, time_range: timeLength.value})
      .then(function(data) {
        let topTracks = data.body.items;
        for(let i = 0; i < topTracks.length; i++){
          trackNameList.push(topTracks[i].name);
          artistNameList.push(topTracks[i].artists[0].name);
          trackIdList.push(topTracks[i].id)
          popularityList.push(topTracks[i].popularity)
        }
        console.log(topTracks);
        console.log(artistNameList);
        console.log(trackIdList);
        console.log(popularityList);
        setTopArtists(artistNameList);
        setTopSongs(trackNameList);
      }, function(err) {
    console.log('Something went wrong!', err);
    });
    spotifyApi.getMe()
      .then(function(data) {
        setUsername(data.body.display_name);
        console.log('Some information about the authenticated user', data.body);
      }, function(err) {
        console.log('Something went wrong!', err);
      });
    return [trackNameList, artistNameList, trackIdList, popularityList]
  }

  function sortFreq(wordDic){
    let sortable = [];
    for (var word in wordDic) {
      sortable.push([word, wordDic[word]]);
    }
    sortable.sort(function(a, b) {
      return a[1] - b[1];
    });
    return sortable;
  }

  function removeStopWords(wordArray){
    let startArray = []
    for(let i = 0; i < wordArray.length; i++){
      if(stopwords.includes(wordArray[i][0])){
      }else{
        if((wordArray[i][0].includes("/")) || (wordArray[i][0].includes("\\")) || (wordArray[i][0].includes("0")) || 
          (wordArray[i][0].includes("1")) || (wordArray[i][0].includes("2")) || (wordArray[i][0].includes("3")) || 
          (wordArray[i][0].includes("4")) || (wordArray[i][0].includes("5")) || (wordArray[i][0].includes("8")) || 
          (wordArray[i][0].includes("6")) || (wordArray[i][0].includes("7")) || (wordArray[i][0].includes("9")) || 
          (wordArray[i][0].includes("[")) || (wordArray[i][0].includes("]")) || (wordArray[i][0].includes("%")) || 
          (wordArray[i][0].includes("+")) || (wordArray[i][0].includes("=")) || (wordArray[i][0].includes("@")) || 
          (wordArray[i][0].includes(">")) || (wordArray[i][0].includes("<")) || (wordArray[i][0].includes("$")) || 
          (wordArray[i][0].includes("#")) || (wordArray[i][0].includes("&")) || (wordArray[i][0].includes("*")) ||
          (wordArray[i][0].includes("\"")) || (wordArray[i][0].slice(-1) == "-") || ((useExplicitWords == true) && explicitWords.includes(wordArray[i][0]))){
        }else{
          startArray.push({
            'text': wordArray[i][0],
            'value': wordArray[i][1]
          })
        }
      }
    }
    return startArray;
  }

  const callLyrics = async () => {
    if (!accessToken) return;
    
    setIsDisabled(true);
    setIsLoading(true);
    console.log(useExplicitWords);
    let lyricsList = [];
    let noLyricCount = 0;

    let trackListFunc = getLists()[0]
    let artistListFunc = getLists()[1]
    let trackIdListFunc = getLists()[2]
    let popularityList = getLists()[3]

    //console.log(trackListFunc)

    for(let i = 0; i < 50; i++){
      await (async () => {
        const {
          data: { lyrics },
        } = await axios.get(`${process.env.REACT_APP_BASE_URL}/lyrics3`, {
          params: {
            track: trackListFunc[i],
            artist: artistListFunc[i],
          },
        })     
        console.log("TRACK: ", trackListFunc[i]);
        console.log("ARTIST: ", artistListFunc[i]);  
        if(lyrics != undefined){
          lyricsList.push(lyrics);
          console.log(lyricsList[i]);
          noLyricCount = 0;
        }else{
          lyricsList.push("No Lyrics Available");
          console.log("No Lyrics Available");
          noLyricCount = noLyricCount + 1;
        }
        setSongsGrabbed((i + 1) * 2);
      })()
    }
    console.log(lyricsList);
    let energyList = []
    let valenceList = []
    let danceabilityList = []
    spotifyApi.getAudioFeaturesForTracks(trackIdListFunc)
      .then(function(data) {
        let trackData = data.body.audio_features;
        energyList = trackData.map(obj => obj.energy);
        valenceList = trackData.map(obj => obj.valence);
        danceabilityList = trackData.map(obj => obj.danceability);

        let averagePop = popularityList.reduce((acc, value) => acc + value, 0) / popularityList.length;
        let averageEnergy = Math.round((energyList.reduce((acc, value) => acc + value, 0) / energyList.length) * 100);
        let averageValence = Math.round((valenceList.reduce((acc, value) => acc + value, 0) / valenceList.length) * 100);
        let averageDance = Math.round((danceabilityList.reduce((acc, value) => acc + value, 0) / danceabilityList.length) * 100);

        setAvgPop(averagePop)
        setAvgEnergy(averageEnergy)
        setAvgValence(averageValence)
        setAvgDance(averageDance)
      }, function(err) {
        console.log(err);
      });

    let masterLyric = "";
    for(let i = 0; i < lyricsList.length; i++){
      if(lyricsList[i] != "No Lyrics Available"){
        masterLyric = masterLyric.concat(" ", lyricsList[i].replaceAll(',','').replaceAll('(','').replaceAll(')','').replaceAll('?','').replaceAll('!','').toLowerCase());
      }
    }
    let frequencyList = wordFreq(masterLyric);
    console.log(frequencyList);
    let sortedList = sortFreq(frequencyList);
    console.log(sortedList);
    let removedList = removeStopWords(sortedList);
    console.log(removedList);
    let trimmedList = trimList(removedList);
    console.log(trimmedList);
    setWords(trimmedList);
    setIsLoading(false);
    setFinishWords(true);
    let preColorList = []
    if(button1Color != "#808080"){
      preColorList.push(button1Color);
    }
    if(button2Color != "#808080"){
      preColorList.push(button2Color);
    }
    if(button3Color != "#808080"){
      preColorList.push(button3Color);
    }
    if(button4Color != "#808080"){
      preColorList.push(button4Color);
    }
    if(button5Color != "#808080"){
      preColorList.push(button5Color);
    }
    if(button6Color != "#808080"){
      preColorList.push(button6Color);
    }
    setColorList(preColorList);
    setOptions({
      colors: preColorList,
      fontSizes: [18,92],
    });
    console.log(options);
  }

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  const wordCloudStyle = {
    position: 'absolute', // Set the position to absolute
    bottom: 0, // Position the component at the bottom
    left: '50%', // Horizontally center the component
    transform: 'translateX(-50%)', // Move it left by 50% of its own width to center it perfectly
    width: '100%',
    borderRadius: '10px',
    backgroundColor: button7Color,
    //borderRadius: 20
  };

  function getColorPicker(id){
    setShowColorPicker(true);
    setCurrentButton(id);
  }

  function getColorChange(color, event){
    if(currentButton == 1){
      setButton1Color(color.hex);     
    }
    if(currentButton == 2){
      setButton2Color(color.hex);
    }
    if(currentButton == 3){
      setButton3Color(color.hex);
    }
    if(currentButton == 4){
      setButton4Color(color.hex);
    }
    if(currentButton == 5){
      setButton5Color(color.hex);
    }
    if(currentButton == 6){
      setButton6Color(color.hex);
    }
    if(currentButton == 7){
      setButton7Color(color.hex);
      var compColor = new complementaryColors(color.hex);
      console.log("ORIGINAL: ", compColor.complementary()[0])
      setBannerColor(compColor.complementary()[0]);
      console.log("AFTER: ", compColor.complementary()[1])
    }
    setShowColorPicker(false);
  }

  const popover = {
    position: 'absolute',
    zIndex: '2',
  }
  
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }

  function lightenHexColor(hexColor) {
    // Remove the '#' symbol if it's present
    hexColor = hexColor.replace('#', '');

    // Parse the hex color values
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate the new lightened values
    const newR = Math.min(Math.round(r + (255 - r) * 0.5), 255);
    const newG = Math.min(Math.round(g + (255 - g) * 0.5), 255);
    const newB = Math.min(Math.round(b + (255 - b) * 0.5), 255);

    // Convert the new values back to hex
    const newHexColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;

    return newHexColor;
  }

  const cloudDivRef = useRef(null);

  const handleSave = () => {
    const scale = 3;
    DomToImage.toJpeg(document.getElementById('table-container'), { height: 712 * scale, width: 400*scale, quality: 1, style: {
      transform: 'scale('+scale+')',
      transformOrigin: 'top left'
    }}).then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'wordCloud.jpeg';
        link.href = dataUrl;
        link.click();
    });
  };

  const backgroundImage1 = 'url(' + require('./backgrounds/PXL_20230704_234712347~3.jpg') + ')'
  const backgroundImage2 = 'url(' + require('./backgrounds/PXL_20230704_235117573.jpg') + ')'
  const backgroundImage3 = 'url(' + require('./backgrounds/efe-kurnaz-RnCPiXixooY-unsplash.jpg') + ')' //neon
  const backgroundImage4 = 'url(' + require('./backgrounds/iccup-xNtwmcRP-gw-unsplash.jpg') + ')'
  const backgroundImage5 = 'url(' + require('./backgrounds/PXL_20230705_225431505.jpg') + ')'
  const dashboardBackground1 = 'url(' + require('./backgrounds/cloudBackground1.jpg') + ')'


  const cardStyle = {
    width: "400px", 
    //height: '590px',
    height: "712px",
    position: "relative", 
    display: "flex", 
    alignItems: "center", 
    borderWidth: "0px", 
    // borderStyle: "ridge", 
    // borderColor: "gray", 
    borderRadius: "10px", 
    justifyContent: "center", 
    backgroundImage: backgroundImage5,
    backgroundSize: 'cover'
    /**backgroundSize: 'cover', backgroundColor: lightenHexColor(button7Color)**/
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function pickTextColor(bgColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
      "black" : "white";
  }

  const normalCard = {
    //color: pickTextColor(button7Color), 
    color: 'white',
    marginLeft: 5, 
    marginTop: -5, 
    marginBottom: -54, 
    padding: 4, 
    marginTop: 62, 
    textAlign: "center",
    //background: button7Color, 
    borderRadius: 12,
    fontFamily: "AlphaSmoke",
    fontSize: 26,
    lineHeight: 0.9
  }

  const neonCard = {
    marginLeft: 5, 
    marginTop: -5, 
    marginBottom: -70, 
    padding: 4, 
    marginTop: 75, 
  }

  return (
    <DashBoardContainer style={{backgroundImage: dashboardBackground1, backgroundSize: 'cover'}}>
      <TitleDiv style={{fontFamily: "AlphaSmoke", fontWeight: 'bold'}}>
        <p>Lyrify</p>
      </TitleDiv>
      <TopContainer>
        <Select
          value={timeLength}
          onChange={selectHandleChange}
          options={selectChoices}
          placeholder={"Select Time Frame"}
          isDisabled={isDisabled}
        />
        <ColorTitleDiv>
          Select Up To 6 Colors:
        </ColorTitleDiv>
        <div>
          <ColorButton onClick={getColorPicker.bind(this, 1)} disabled={isDisabled} style={{backgroundColor: button1Color, height: 35, width: 35, marginRight:5}}></ColorButton>
          <ColorButton onClick={getColorPicker.bind(this, 2)} disabled={isDisabled} style={{backgroundColor: button2Color, height: 35, width: 35, marginRight:5}}></ColorButton>
          <ColorButton onClick={getColorPicker.bind(this, 3)} disabled={isDisabled} style={{backgroundColor: button3Color, height: 35, width: 35, marginRight:5}}></ColorButton>
          <ColorButton onClick={getColorPicker.bind(this, 4)} disabled={isDisabled} style={{backgroundColor: button4Color, height: 35, width: 35, marginRight:5}}></ColorButton>
          <ColorButton onClick={getColorPicker.bind(this, 5)} disabled={isDisabled} style={{backgroundColor: button5Color, height: 35, width: 35, marginRight:5}}></ColorButton>
          <ColorButton onClick={getColorPicker.bind(this, 6)} disabled={isDisabled} style={{backgroundColor: button6Color, height: 35, width: 35, marginRight:5}}></ColorButton>
        </div>
        <ColorTitleDiv>
          Select Background Color:
        </ColorTitleDiv>
        <div>
          <ColorButton disabled={isDisabled} onClick={getColorPicker.bind(this, 7)} style={{backgroundColor: button7Color, height: 35, width: 240, marginRight:5}}></ColorButton>
        </div>
        {showColorPicker
          ? <div style={ popover }> <div style={ cover } /><SwatchesPicker onChange={getColorChange} /></div>
          : null
        }
        <Checkbox
          onChange={switchExplicit}
          icon={<Icon.FiCheck color="#1db954" size={18} />} 
          label="Remove Explicit Words"
          borderRadius={5}
          size={20}
          style={{marginTop: 18, marginBottom: 8}}
          borderColor="#1db954"
          disabled={isDisabled}
          labelStyle={{ marginLeft: 5, userSelect: "none", fontSize: '14px', fontWeight: 'bold', marginTop: 18, marginBottom: 8}}
        />
        <SelectButton disabled={isDisabled} className="lyricsButton" onClick={callLyrics} style={{marginBottom: 90}}>Get Lyrics</SelectButton>

      </TopContainer>
      {isLoading 
        ? <div><LoadingWord><p>Gathering Lyrical Data...</p></LoadingWord><ProgressBar completed={songsGrabbed} bgColor={"#1DB954"}/></div>
        : <div></div>
      }
      {finishWords
        ?
        <div id='table-container'>
          <Card className="text-left" style={cardStyle}>
          <Card.Title style={normalCard}>{username}'s <br></br>Lyrify Cloud</Card.Title>
          <LyricsContainer ref={cloudDivRef}>
             {/* <TopDiv style={{backgroundColor: lightenHexColor(button7Color)}}>{username}'s Lyrify Cloud</TopDiv> */}
             <div /**className="shadowBox" style={{width: "300px", height: "300px", borderRadius: "20px", position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)'}}**/>
                <ReactWordcloud className="shadowBox" style={wordCloudStyle} words={words} options={options} size={size}></ReactWordcloud>
             </div>
         </LyricsContainer>
        <Card.Body style={{width: "400px", background: "rgba(255, 255, 255, 0.4)"}}>
          <Card.Title style={{marginTop: -12, marginBottom: 3, marginRight: 5, marginLeft: 5}}>Metrics</Card.Title>
          <Card.Text>
            <div style={{marginBottom: 5, marginRight: 5, marginLeft: 5, borderColor: 'black', borderWidth: 1}}>
              <ProgressBar completed={avgPop} bgColor={colorList[1 % colorList.length]} labelAlignment="left" height="25px" labelColor={pickTextColor(button1Color)} style={{marginBottom: 5}} customLabel="Popularity" transitionDuration="5s" animateOnRender={true} className="barClass"/>
            </div>
            <div style={{marginBottom: 5, marginRight: 5, marginLeft: 5, borderColor: 'black', borderWidth: 1}}>
              <ProgressBar completed={avgEnergy} bgColor={colorList[2 % colorList.length]} labelAlignment="left" height="25px" labelColor={pickTextColor(button2Color)} style={{marginBottom: 5}} customLabel="Energy" transitionDuration="5s" animateOnRender={true} className="barClass"/>
            </div>
            <div style={{marginBottom: 5, marginRight: 5, marginLeft: 5, borderColor: 'black', borderWidth: 1}}>
              <ProgressBar completed={avgValence} bgColor={colorList[3 % colorList.length]} labelAlignment="left" height="25px" labelColor={pickTextColor(button3Color)} style={{marginBottom: 5}} customLabel="Valence" transitionDuration="5s" animateOnRender={true} className="barClass"/>
            </div>
            <div style={{marginBottom: 5, marginRight: 5, marginLeft: 5, borderColor: 'black', borderWidth: 1}}>
              <ProgressBar completed={avgDance} bgColor={colorList[4 % colorList.length]} labelAlignment="left" height="25px" labelColor={pickTextColor(button4Color)} style={{marginBottom: 5}} customLabel="Danceability" transitionDuration="5s" animateOnRender={true} className="barClass"/>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
      </div>
        // <LyricsContainer id="table-container" ref={cloudDivRef}>
        //     <TopDiv style={{backgroundColor: lightenHexColor(button7Color)}}>{username}'s Lyrify Cloud</TopDiv>
        //     <ReactWordcloud style={wordCloudStyle} words={words} options={options} size={size}></ReactWordcloud>
        // </LyricsContainer>
        : null
      }
      <div style={{textAlign: "center"}}>
        {finishWords
          ?<div><SelectButton onClick={resetState} style={{backgroundColor: "#3487ed", marginRight: 5, fontSize: 18}}>Go Again?</SelectButton>
            <SelectButton onClick={handleSave} style={{fontSize: 18}}>Download Image</SelectButton>
            {/* <SelectButton onClick={() => exportAsImage(cloudDivRef.current, "test")}>Download Image</SelectButton> */}
          </div>
          : null
        }
      </div> 
    </DashBoardContainer>
  )
}

export default Dashboard;