import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { storageService } from '../storageService';

const defaultMajorSystem = [
    { id: "00", word: "ZiZi saqichi" }, { id: "01", word: "ZayTun" }, { id: "02", word: "ZaNjir" }, { id: "03", word: "ZoMbi" }, { id: "04", word: "ZaR" },
    { id: "05", word: "ZuLuk" }, { id: "06", word: "ZeBra" }, { id: "07", word: "Zirak" }, { id: "08", word: "ZeFir" }, { id: "09", word: "ZGushyonka" },
    { id: "10", word: "TaroZi" }, { id: "11", word: "To'Ti" }, { id: "12", word: "TaNka" }, { id: "13", word: "ToMat" }, { id: "14", word: "TRaktor" },
    { id: "15", word: "Tilla" }, { id: "16", word: "TaBuretka" }, { id: "17", word: "TiKan" }, { id: "18", word: "TuFli" }, { id: "19", word: "TanGa" },
    { id: "20", word: "NayZa" }, { id: "21", word: "NouTbuk" }, { id: "22", word: "NoN" }, { id: "23", word: "NeMo" }, { id: "24", word: "NaRvon" },
    { id: "25", word: "NiLufar guli" }, { id: "26", word: "NoBel" }, { id: "27", word: "NoK" }, { id: "28", word: "NeFt" }, { id: "29", word: "NeGr" },
    { id: "30", word: "MuZ" }, { id: "31", word: "MoTor" }, { id: "32", word: "MuNchoq" }, { id: "33", word: "MuMiya" }, { id: "34", word: "MaRker" },
    { id: "35", word: "Malina" }, { id: "36", word: "MoBil telefon" }, { id: "37", word: "MaKaron" }, { id: "38", word: "MikroFon" }, { id: "39", word: "MaGnit" },
    { id: "40", word: "Ro'Za" }, { id: "41", word: "RaTsiya" }, { id: "42", word: "RaNda" }, { id: "43", word: "Ro'Mol" }, { id: "44", word: "aRRa" },
    { id: "45", word: "RuL" }, { id: "46", word: "RuBob" }, { id: "47", word: "RaKeta" }, { id: "48", word: "RaFaello" }, { id: "49", word: "RoGatka" },
    { id: "50", word: "LaZer" }, { id: "51", word: "LaTta" }, { id: "52", word: "LeNta" }, { id: "53", word: "LiMon" }, { id: "54", word: "LangaR" },
    { id: "55", word: "LaLaku" }, { id: "56", word: "LaB" }, { id: "57", word: "Laylak" }, { id: "58", word: "LiFt" }, { id: "59", word: "LaGan" },
    { id: "60", word: "BiZon" }, { id: "61", word: "BuTilka" }, { id: "62", word: "BaNan" }, { id: "63", word: "BeMbi" }, { id: "64", word: "BaRaban" },
    { id: "65", word: "BoLta" }, { id: "66", word: "Bo'mBa" }, { id: "67", word: "BoKal" }, { id: "68", word: "BuFer" }, { id: "69", word: "BeGemot" },
    { id: "70", word: "KO'Z" }, { id: "71", word: "KiTob" }, { id: "72", word: "KoNfet" }, { id: "73", word: "KaMon" }, { id: "74", word: "KaRtoshka" },
    { id: "75", word: "KoLa" }, { id: "76", word: "KaBob" }, { id: "77", word: "Kaktus" }, { id: "78", word: "KoFe" }, { id: "79", word: "KeGli" },
    { id: "80", word: "Fizik (Eynshteyn)" }, { id: "81", word: "FuTbolka" }, { id: "82", word: "FeN" }, { id: "83", word: "FM radio" }, { id: "84", word: "FaRtuk" },
    { id: "85", word: "FiL" }, { id: "86", word: "FBr xodimi" }, { id: "87", word: "FoKus shlyapasi" }, { id: "88", word: "FiFa kubogi" }, { id: "89", word: "FalGa" },
    { id: "90", word: "GaZ" }, { id: "91", word: "GiTler" }, { id: "92", word: "GNom" }, { id: "93", word: "GuMma" }, { id: "94", word: "GitaRa" },
    { id: "95", word: "GaLstuk" }, { id: "96", word: "GoBlin" }, { id: "97", word: "GulKaram" }, { id: "98", word: "GraFin" }, { id: "99", word: "GuGurt" }
];

interface MajorSystemEditorProps {
    onClose: () => void;
}

const MajorSystemEditor: React.FC<MajorSystemEditorProps> = ({ onClose }) => {
    const [data, setData] = useState(storageService.getMajorSystem() || defaultMajorSystem);

    const handleEdit = (id: string, newWord: string) => {
        setData(prev => prev.map(item => item.id === id ? { ...item, word: newWord } : item));
    };

    const handleSave = () => {
        storageService.saveMajorSystem(data);
        onClose();
    };

    const handleReset = () => {
        if (window.confirm("Barcha o'zgarishlarni bekor qilib, standart holatga qaytarasizmi?")) {
            setData(defaultMajorSystem);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-stretch md:items-center justify-center md:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border-t border-x md:border-[7px] border-white/10 w-full max-w-6xl mt-[64px] md:mt-0 h-[calc(100vh-64px)] md:h-[85vh] md:bottom-[-170px] md:left-[-25px] rounded-t-[2rem] md:rounded-[2rem] flex flex-col shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Major System (00-99)</h2>
                        <p className="text-slate-400 text-sm">Raqamlar uchun o'z so'zlaringizni tahrirlang.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleReset} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors" title="Asliga qaytarish">
                            <RotateCcw size={20} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {data.map((item) => (
                            <div key={item.id} className="glass dark:bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-2 group transition-all hover:border-indigo-500/30 hover:bg-white/10">
                                <span className="text-xs font-black text-indigo-500 font-mono tracking-widest">{item.id}</span>
                                <input
                                    type="text"
                                    value={item.word}
                                    onChange={(e) => handleEdit(item.id, e.target.value)}
                                    className="bg-transparent border-none outline-none text-white font-medium p-0 focus:ring-0 w-full text-sm"
                                    placeholder="So'z kiriting..."
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/5 transition-all"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Save size={20} /> Saqlash
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MajorSystemEditor;
