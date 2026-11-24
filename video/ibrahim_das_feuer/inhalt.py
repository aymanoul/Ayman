"""Alle Texte exakt nach Vorgabe. Nichts hier umformulieren."""

TEIL_A = [
    "Sie warfen ihn ins Feuer.",
    "Dann kam ein Befehl – an das Feuer selbst.",
    "Ein Volk, das Statuen diente.",
    "Und ein junger Mann namens Ibrahim عليه السلام fragte sie:",
    "„Was sind das für Bildwerke, deren Andacht ihr euch hingebt?“",
    "Als die Leute gegangen waren, zerschlug er die Statuen in Stücke.",
    "Nur die größte ließ er stehen.",
    "Sie fragten: „Wer hat dies mit unseren Göttern getan?“",
    "Ibrahim عليه السلام sagte: „Nein! Vielmehr hat das dieser Große unter ihnen getan. Fragt sie doch, wenn sie reden können.“",
    "Da sagten sie: „Verbrennt ihn und helft euren Göttern, wenn ihr etwas tun wollt.“",
    "Ibn Abbas berichtet: Als Ibrahim عليه السلام ins Feuer geworfen wurde, sagte er:",
    "„Unsere Genüge ist Allah, und wie trefflich ist der Sachwalter!“",
    "Dann kam Allahs ﷻ Befehl:",
]

TEIL_B = [
    "Und Allah ﷻ rettete ihn aus dem Feuer.",
    "Wenn du Angst hast, sag, was Ibrahim عليه السلام sagte:",
    "„Unsere Genüge ist Allah, und wie trefflich ist der Sachwalter!“",
    "Folge der Spur der Propheten.",
]

# Sätze, die als Einblendung (Hadith) statt als Untertitel erscheinen
OVERLAY_SENTENCES = {"A11", "B2"}

KEYWORDS = ["Feuer", "Statuen", "zerschlug", "Verbrennt", "Allah", "rettete", "Angst"]

HOOK_LINES = [["SIE", "WARFEN", "IHN"], ["INS", "FEUER."]]
HOOK_GOLD = "FEUER"

DUA_AR = "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ"
DUA_DE = "Unsere Genüge ist Allah, und wie trefflich ist der Sachwalter!"
DUA_SRC = "Sahih al-Bukhari 4563"

QURAN_AR = "قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ"
QURAN_NR = "﴿٦٩﴾"
QURAN_DE = "Wir sagten: ‚O Feuer, sei Kühlung und Unversehrtheit für Ibrahim.‘"
QURAN_SRC = "Sura al-Anbiya 21:69"

HANDLE = "@spurderpropheten"

# Gesprochene Form für Zeitzuordnung (Untertitel zeigen trotzdem den Originaltext)
SPOKEN = {
    "عليه السلام": ["friede", "sei", "auf", "ihm"],
    "ﷻ": [],
}

ASSETS_AUDIO = ["sprecher_A.mp3", "sprecher_B.mp3", "quran_21_69.mp3",
                "sfx_feuer_gross.mp3", "sfx_wind.mp3", "sfx_steine.mp3",
                "sfx_fackeln.mp3", "sfx_zuenden.mp3", "sfx_glut.mp3"]
ASSETS_IMG = ["01_flammenwand.png", "02_stadt.png", "03_halle.png", "04_stadttor.png",
              "05_splitter.png", "06_platz.png", "07_bau.png", "08_inferno.png",
              "09_kuehles_licht.png", "10_morgen.png", "11_spur.png"]
