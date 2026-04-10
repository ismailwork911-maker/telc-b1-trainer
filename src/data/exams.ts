import type { ExamData } from '../types';

const exam1: ExamData = {
  id: 1,
  title: 'Modelltest 1',
  hoeren: {
    teil1: {
      questions: [
        { id: 1, context: 'Sie hören eine Ansage am Telefon.', text: 'Die Praxis von Dr. Müller ist am Mittwoch geschlossen.', correct: true },
        { id: 2, context: 'Sie hören eine Nachricht auf dem Anrufbeantworter.', text: 'Frau Schmidt möchte den Termin am Freitag verschieben.', correct: true },
        { id: 3, context: 'Sie hören eine Durchsage im Supermarkt.', text: 'Das Sonderangebot gilt nur für heute.', correct: false },
        { id: 4, context: 'Sie hören eine Information im Radio.', text: 'Die Autobahn A7 ist wegen eines Unfalls gesperrt.', correct: true },
        { id: 5, context: 'Sie hören eine Ansage am Bahnhof.', text: 'Der Zug nach München fährt von Gleis 3 ab.', correct: false },
      ],
    },
    teil2: {
      questions: [
        { id: 6, context: 'Sie hören ein Gespräch zwischen zwei Kollegen.', text: 'Was möchte der Mann in seiner Freizeit machen?', options: ['a) Einen Sprachkurs besuchen', 'b) Im Garten arbeiten', 'c) Sport treiben'], correct: 0 },
        { id: 7, context: 'Sie hören ein Gespräch im Reisebüro.', text: 'Wohin möchte die Frau reisen?', options: ['a) Nach Spanien', 'b) Nach Italien', 'c) Nach Griechenland'], correct: 1 },
        { id: 8, context: 'Sie hören ein Telefongespräch.', text: 'Wann findet das Treffen statt?', options: ['a) Am Montag um 14 Uhr', 'b) Am Dienstag um 10 Uhr', 'c) Am Mittwoch um 16 Uhr'], correct: 2 },
        { id: 9, context: 'Sie hören ein Interview im Radio.', text: 'Was ist das Thema des Interviews?', options: ['a) Gesunde Ernährung', 'b) Umweltschutz', 'c) Digitalisierung'], correct: 0 },
        { id: 10, context: 'Sie hören ein Gespräch zwischen Nachbarn.', text: 'Worüber beschwert sich die Frau?', options: ['a) Über den Lärm', 'b) Über den Müll', 'c) Über das Parken'], correct: 0 },
        { id: 11, context: 'Sie hören eine Diskussion.', text: 'Was schlägt der Mann vor?', options: ['a) Eine neue Regel einzuführen', 'b) Ein Fest zu organisieren', 'c) Den Verein zu verlassen'], correct: 1 },
        { id: 12, context: 'Sie hören ein Gespräch in der Schule.', text: 'Welches Fach mag das Kind am liebsten?', options: ['a) Mathematik', 'b) Kunst', 'c) Sport'], correct: 2 },
        { id: 13, context: 'Sie hören ein Gespräch beim Arzt.', text: 'Was empfiehlt der Arzt?', options: ['a) Mehr Wasser trinken', 'b) Weniger arbeiten', 'c) Regelmäßig spazieren gehen'], correct: 2 },
        { id: 14, context: 'Sie hören ein Gespräch im Geschäft.', text: 'Warum gibt die Kundin die Jacke zurück?', options: ['a) Sie ist zu klein', 'b) Die Farbe gefällt ihr nicht', 'c) Sie hat einen Fehler'], correct: 1 },
        { id: 15, context: 'Sie hören eine Radiosendung.', text: 'Worum geht es in der Sendung?', options: ['a) Um Tipps für die Wohnungssuche', 'b) Um ein neues Kochbuch', 'c) Um Reiseangebote'], correct: 0 },
      ],
    },
    teil3: {
      questions: [
        { id: 16, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 1 findet, dass Kinder mehr draußen spielen sollten.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 0 },
        { id: 17, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 2 meint, dass die Schule zu viel Stress macht.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 0 },
        { id: 18, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 3 findet Hausaufgaben wichtig für das Lernen.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 1 },
        { id: 19, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 4 wünscht sich mehr Sportunterricht.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 0 },
        { id: 20, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 5 hat keine Meinung zu dem Thema.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 1 },
        { id: 21, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 6 findet, dass Kinder zu viel am Computer sitzen.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 0 },
        { id: 22, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 7 möchte mehr Musikunterricht.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 2 },
        { id: 23, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 8 findet die Schulzeiten zu früh.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 0 },
        { id: 24, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 9 ist zufrieden mit dem Schulsystem.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 1 },
        { id: 25, context: 'Sie hören Meinungen zu einem Thema.', text: 'Person 10 möchte kleinere Klassen.', options: ['a) Stimmt', 'b) Stimmt nicht', 'c) Nicht gesagt'], correct: 0 },
      ],
    },
  },
  lesen: {
    teil1: {
      texts: [
        { id: 'A', heading: 'Wandern im Schwarzwald', content: 'Der Schwarzwald bietet zahlreiche Wanderwege für alle Schwierigkeitsgrade. Besonders im Herbst ist die Landschaft wunderschön.' },
        { id: 'B', heading: 'Schwimmen lernen', content: 'Viele Vereine bieten Schwimmkurse für Kinder und Erwachsene an. Die Kurse finden meistens am Wochenende statt.' },
        { id: 'C', heading: 'Kochen als Hobby', content: 'Immer mehr Menschen entdecken das Kochen als kreatives Hobby. Kochkurse sind besonders bei jungen Leuten beliebt.' },
        { id: 'D', heading: 'Fahrradfahren in der Stadt', content: 'Viele Städte bauen ihre Radwege aus. Fahrradfahren ist gesund und gut für die Umwelt.' },
        { id: 'E', heading: 'Yoga für Anfänger', content: 'Yoga hilft bei Stress und verbessert die Flexibilität. Es gibt viele Online-Kurse für Anfänger.' },
        { id: 'F', heading: 'Gärtnern auf dem Balkon', content: 'Auch auf kleinem Raum kann man Kräuter und Gemüse anbauen. Balkongärtnern liegt im Trend.' },
        { id: 'G', heading: 'Fotografieren lernen', content: 'Mit der Smartphone-Kamera kann jeder fotografieren lernen. Workshops vermitteln die Grundlagen der Bildkomposition.' },
        { id: 'H', heading: 'Ehrenamt in der Gemeinde', content: 'Freiwillige Arbeit stärkt die Gemeinschaft. Viele Menschen engagieren sich in Vereinen und sozialen Projekten.' },
      ],
      questions: [
        { id: 26, text: 'Frau Berger sucht ein Hobby, das sie zu Hause machen kann, weil sie einen kleinen Balkon hat.', correct: 'F' },
        { id: 27, text: 'Herr Wagner möchte in seiner Freizeit etwas für seine Gesundheit tun und sucht einen Kurs.', correct: 'E' },
        { id: 28, text: 'Familie Klein sucht eine Aktivität in der Natur für den nächsten Urlaub.', correct: 'A' },
        { id: 29, text: 'Frau Schulz möchte sich sozial engagieren und anderen Menschen helfen.', correct: 'H' },
        { id: 30, text: 'Herr Fischer möchte mit seinem Smartphone bessere Bilder machen.', correct: 'G' },
      ],
    },
    teil2: {
      situations: [
        { id: 31, text: 'Sie suchen einen Deutschkurs am Abend.', correct: 'C' },
        { id: 32, text: 'Sie brauchen einen Kinderarzt für Ihr Kind.', correct: 'A' },
        { id: 33, text: 'Sie möchten am Wochenende ins Theater.', correct: 'E' },
        { id: 34, text: 'Sie suchen eine günstige Wohnung in der Stadtmitte.', correct: 'B' },
        { id: 35, text: 'Sie möchten einen gebrauchten Laptop kaufen.', correct: 'D' },
      ],
      ads: [
        { id: 'A', title: 'Kinderarztpraxis Dr. Weber', content: 'Montag bis Freitag, 8–17 Uhr. Termine auch kurzfristig möglich. Alle Kassen.' },
        { id: 'B', title: '2-Zimmer-Wohnung, Zentrum', content: '45 m², 450€ warm, ab sofort frei. Nähe U-Bahn. Kontakt: 030-12345.' },
        { id: 'C', title: 'Deutsch-Abendkurs B1', content: 'Volkshochschule Berlin. Mo + Mi, 18:30–20:00. Start: nächsten Monat. Anmeldung online.' },
        { id: 'D', title: 'Laptop zu verkaufen', content: 'Lenovo ThinkPad, 2 Jahre alt, guter Zustand. 200€ VB. Tel: 0179-98765.' },
        { id: 'E', title: 'Theaterpremiere: „Der Besuch"', content: 'Samstag 20 Uhr, Stadttheater. Karten ab 15€. Online-Reservierung möglich.' },
        { id: 'F', title: 'Babysitter gesucht', content: 'Für 2 Kinder (3 und 5 Jahre). Dienstag und Donnerstag, 15–18 Uhr.' },
        { id: 'G', title: 'Flohmarkt am Rathaus', content: 'Jeden 1. Sonntag im Monat, 9–15 Uhr. Standgebühr: 10€. Anmeldung erforderlich.' },
        { id: 'H', title: 'Yoga-Kurs für Senioren', content: 'Jeden Mittwoch, 10–11 Uhr. Gemeindehaus, Kirchstraße 5. Kostenlos.' },
      ],
    },
    teil3: {
      passage: 'Das Homeoffice hat sich in den letzten Jahren stark verbreitet. Viele Arbeitnehmer arbeiten mindestens einen Tag pro Woche von zu Hause aus. Die Vorteile sind klar: Man spart Zeit für den Arbeitsweg, kann sich die Arbeit flexibler einteilen und hat mehr Zeit für die Familie. Allerdings gibt es auch Nachteile. Manche Menschen fühlen sich isoliert und vermissen den Kontakt zu den Kollegen. Auch die Trennung von Arbeit und Freizeit fällt vielen schwer. Experten empfehlen, feste Arbeitszeiten einzuhalten und einen separaten Arbeitsplatz einzurichten. Einige Unternehmen bieten inzwischen hybride Modelle an, bei denen die Mitarbeiter teils im Büro und teils zu Hause arbeiten. Diese Lösung scheint für viele die beste zu sein.',
      questions: [
        { id: 36, text: 'Was ist der Hauptvorteil des Homeoffice?', options: ['a) Man verdient mehr Geld', 'b) Man spart Zeit und ist flexibler', 'c) Man hat mehr Urlaubstage'], correct: 1 },
        { id: 37, text: 'Was ist ein häufiges Problem beim Homeoffice?', options: ['a) Die Technik funktioniert nicht', 'b) Man fühlt sich isoliert', 'c) Man muss mehr arbeiten'], correct: 1 },
        { id: 38, text: 'Was empfehlen Experten?', options: ['a) Jeden Tag ins Büro gehen', 'b) Feste Arbeitszeiten und einen separaten Arbeitsplatz', 'c) Den Job wechseln'], correct: 1 },
        { id: 39, text: 'Was bieten einige Unternehmen an?', options: ['a) Nur Homeoffice', 'b) Nur Büroarbeit', 'c) Hybride Modelle'], correct: 2 },
        { id: 40, text: 'Wie viele Tage arbeiten viele Arbeitnehmer von zu Hause?', options: ['a) Jeden Tag', 'b) Mindestens einen Tag pro Woche', 'c) Nur im Sommer'], correct: 1 },
        { id: 41, text: 'Was vermissen manche Menschen im Homeoffice?', options: ['a) Das Essen in der Kantine', 'b) Den Kontakt zu Kollegen', 'c) Die Parkplätze'], correct: 1 },
        { id: 42, text: 'Warum fällt die Trennung von Arbeit und Freizeit schwer?', options: ['a) Weil man zu wenig arbeitet', 'b) Weil man zu Hause arbeitet', 'c) Weil es keine Regeln gibt'], correct: 1 },
        { id: 43, text: 'Welche Lösung scheint die beste zu sein?', options: ['a) Vollständiges Homeoffice', 'b) Hybride Modelle', 'c) Keine Änderung'], correct: 1 },
        { id: 44, text: 'Was hat sich in den letzten Jahren verbreitet?', options: ['a) Teilzeitarbeit', 'b) Das Homeoffice', 'c) Jobsharing'], correct: 1 },
        { id: 45, text: 'Für wen ist die hybride Lösung gut?', options: ['a) Nur für Chefs', 'b) Für viele Mitarbeiter', 'c) Nur für junge Leute'], correct: 1 },
      ],
    },
  },
  sprachbausteine: {
    teil1: {
      text: 'Liebe Maria,\n\nvielen Dank für deine Einladung! Ich __1__ mich sehr darüber gefreut. Leider __2__ ich am Samstag nicht kommen, __3__ ich an diesem Tag arbeiten muss. __4__ wir uns vielleicht am Sonntag treffen? Ich __5__ gern zu dir kommen. Sag mir bitte Bescheid, __6__ dir das passt. Ich bringe auch gern einen Kuchen __7__. Hast du __8__ einen bestimmten Wunsch? Ich kann gut Apfelkuchen __9__. Ich hoffe, wir sehen __10__ bald!\n\nLiebe Grüße\nAnna',
      questions: [
        { id: 46, text: 'Lücke 1', options: ['a) habe', 'b) bin', 'c) werde'], correct: 0 },
        { id: 47, text: 'Lücke 2', options: ['a) darf', 'b) kann', 'c) soll'], correct: 1 },
        { id: 48, text: 'Lücke 3', options: ['a) dass', 'b) weil', 'c) obwohl'], correct: 1 },
        { id: 49, text: 'Lücke 4', options: ['a) Können', 'b) Dürfen', 'c) Müssen'], correct: 0 },
        { id: 50, text: 'Lücke 5', options: ['a) möchte', 'b) würde', 'c) sollte'], correct: 1 },
        { id: 51, text: 'Lücke 6', options: ['a) wenn', 'b) ob', 'c) als'], correct: 1 },
        { id: 52, text: 'Lücke 7', options: ['a) an', 'b) mit', 'c) zu'], correct: 1 },
        { id: 53, text: 'Lücke 8', options: ['a) dafür', 'b) dazu', 'c) davon'], correct: 1 },
        { id: 54, text: 'Lücke 9', options: ['a) kochen', 'b) backen', 'c) machen'], correct: 1 },
        { id: 55, text: 'Lücke 10', options: ['a) euch', 'b) sich', 'c) uns'], correct: 2 },
      ],
    },
    teil2: {
      text: 'Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, __11__ ich eine Frage zu Ihrem Kursangebot habe. Ich interessiere mich __12__ den Deutschkurs B2. Könnten Sie mir bitte mitteilen, __13__ der nächste Kurs beginnt? Außerdem möchte ich wissen, __14__ die Kursgebühr beträgt. Ich habe __15__ die B1-Prüfung bestanden und möchte mein Deutsch __16__ verbessern. Ist es möglich, __17__ ich vorher einen Einstufungstest mache? Bitte senden Sie mir __18__ die Anmeldeunterlagen. Ich __19__ mich über eine schnelle Antwort sehr freuen.\n\nMit freundlichen __20__\nMehmet Yilmaz',
      questions: [
        { id: 56, text: 'Lücke 11', options: ['a) weil', 'b) damit', 'c) obwohl'], correct: 0 },
        { id: 57, text: 'Lücke 12', options: ['a) an', 'b) für', 'c) über'], correct: 1 },
        { id: 58, text: 'Lücke 13', options: ['a) wann', 'b) wenn', 'c) als'], correct: 0 },
        { id: 59, text: 'Lücke 14', options: ['a) wieviel', 'b) wie viel', 'c) was'], correct: 1 },
        { id: 60, text: 'Lücke 15', options: ['a) schon', 'b) noch', 'c) erst'], correct: 0 },
        { id: 61, text: 'Lücke 16', options: ['a) weiter', 'b) wieder', 'c) mehr'], correct: 0 },
        { id: 62, text: 'Lücke 17', options: ['a) ob', 'b) dass', 'c) wenn'], correct: 1 },
        { id: 63, text: 'Lücke 18', options: ['a) bitte', 'b) gern', 'c) auch'], correct: 0 },
        { id: 64, text: 'Lücke 19', options: ['a) werde', 'b) würde', 'c) könnte'], correct: 1 },
        { id: 65, text: 'Lücke 20', options: ['a) Grüßen', 'b) Gruß', 'c) Grüße'], correct: 0 },
      ],
    },
  },
  schreiben: {
    prompt: 'Sie haben eine Anzeige für einen Spanischkurs gelesen und möchten sich anmelden. Schreiben Sie eine E-Mail an die Sprachschule.',
    type: 'formal',
    bulletPoints: [
      'Warum Sie Spanisch lernen möchten',
      'Wann Sie Zeit für den Kurs haben',
      'Ob Sie schon Vorkenntnisse haben',
      'Wie Sie bezahlen möchten',
    ],
  },
  sprechen: [
    {
      part: 1,
      title: 'Kontaktaufnahme',
      description: 'Stellen Sie sich Ihrem Partner / Ihrer Partnerin vor. Sprechen Sie über: Name, Herkunft, Wohnort, Arbeit/Beruf, Familie, Hobbys.',
      prepTime: 0,
    },
    {
      part: 2,
      title: 'Gespräch über ein Thema',
      description: 'Thema: „Sollen Kinder ein eigenes Smartphone haben?"\n\nSprechen Sie über folgende Punkte:\n- Ihre Meinung zu dem Thema\n- Vorteile und Nachteile\n- Persönliche Erfahrungen\n- Situation in Ihrem Heimatland',
      prepTime: 600,
    },
    {
      part: 3,
      title: 'Gemeinsam etwas planen',
      description: 'Sie möchten mit Ihrem Partner / Ihrer Partnerin ein Abschiedsfest für einen Kollegen planen. Besprechen Sie:\n- Wann und wo soll das Fest stattfinden?\n- Essen und Getränke\n- Geschenk\n- Wer soll eingeladen werden?',
      prepTime: 600,
    },
  ],
};

// Generate placeholder exams 2-15 based on exam 1 structure
function generatePlaceholderExam(id: number): ExamData {
  return {
    ...exam1,
    id,
    title: `Modelltest ${id}`,
  };
}

export const exams: ExamData[] = [
  exam1,
  ...Array.from({ length: 14 }, (_, i) => generatePlaceholderExam(i + 2)),
];

export function getExam(id: number): ExamData | undefined {
  return exams.find(e => e.id === id);
}
