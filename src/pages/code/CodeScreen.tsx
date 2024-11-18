import React, { useState } from 'react';
import Description from './Description';
import Compiler from './Compiler';
import { CodingQuestionData } from '../../types/Exam';
import { useAuth } from '../../context/AuthProvider';
interface QuestionProps {
    handleNextButtonClick: () => void;
    questionData: CodingQuestionData;
    stats: any;
    setStats: any;
    seconds: number;
}

const CodeScreen: React.FC<QuestionProps> = (
    {
        handleNextButtonClick,
        questionData,
        stats,
        setStats,
        seconds
    }
) => {

    const { authState } = useAuth();

    const [setting, setSetting] = useState({
        index: 0,
        qs: [1, 2, 3],
        refreshBody: 0,
        lang: '62',
        availableLang: ['62', '71', '50', '54'],
        testWindowSize: 30,
        pageLoader: true
    })

    function closeResultWindow() {
        setSetting({
            ...setting,
            testWindowSize: 0
        })
    };


    function openResultWindow() {
        setSetting({
            ...setting,
            testWindowSize: 30
        });
    }



    function changeLanguage(langId: string) {
        if (langId === setting.lang) {
            return;
        }
        if (!setting.availableLang.includes(langId)) {
            return;
        }
        setSetting({
            ...setting,
            lang: langId
        })
    }

    function defaultString(lang: string, special: string) {
        if (special.length > 0) {
            return `${special} Insert your ${lang} code here`;
        }

        return `// Insert your ${lang} code here`
    }


    const generateCodeSet = () => ({
        java: defaultString('Java', ''),
        python: defaultString('Python', '#'),
        c: defaultString('C', ''),
        cpp: defaultString('C++', '')
    })




    const [code, setCode] = useState(Array.from({ length: 2 }, () => generateCodeSet()))


    function changeIndex(index: number) {
        if (index < 0 || index >= setting.qs.length || index === setting.index) {
            return;
        }
        setSetting({
            ...setting,
            index,
        });
        handleNextButtonClick();
    }

    function updateCode(index: number, language: 'java' | 'python' | 'c' | 'cpp', newCode: string) {
        console.log(index, language, newCode);
        setCode(prevCode =>
            prevCode.map((codeSet, i) => {
                if (i === index) {
                    return {
                        ...codeSet,
                        [language]: newCode // Update the specific language's code
                    };
                }
                return codeSet; // Return the existing codeSet for other indices
            })
        );
    }


    if (code.length <= 0) {
        return <p>Loading</p>;
    }

    return (
        <div className='w-full h-screen bg-slate-100'>
            <div className='w-full relative h-[calc(100vh-80px)] flex'>
                <span className='bg-white w-auto p-2 h-full items-center justify-center flex flex-col gap-1 '>
                    {
                        Array.from({ length: authState.totalQuestions }).map((item, index) => {
                            const openTooltip = (tooltipIndex: number) => {
                                const tooltip = document.getElementById(`tooltip-${index}`);

                                if (tooltip) {
                                    tooltip.classList.remove('hidden');
                                }
                            }
                            const hideTooltip = (tooltipIndex: number) => {
                                const tooltip = document.getElementById(`tooltip-${index}`);
                                if (tooltip) {
                                    tooltip.classList.add('hidden');
                                }
                                changeIndex(tooltipIndex);
                            }
                            return (
                                <div className='relative w-10'>
                                    <button disabled={setting.index >= index} onClick={() => openTooltip(index)} className={` z-0 inline-flex h-10 w-10 border ${setting.index < index ? 'border-sky-300 text-sky-300 hover:bg-sky-200 hover:text-white' : setting.index > index ? 'bg-sky-200 text-white border-white' : 'bg-sky-300 text-white border-white'} rounded-full items-center justify-center `}>{index + 1}
                                    </button>
                                    <span id={`tooltip-${index}`} className={`shadow z-10 w-80 hidden top-0 left-12 absolute bg-white p-2`}>
                                        <p className='text-sm font-semibold text-gray-800'>You will not be able to get back to this question</p>
                                        <p className='text-xs text-gray-500'>Would you like to continue?</p>
                                        <button onClick={() => hideTooltip(index)} className='my-2 rounded-md bg-black text-white px-2 py-1'>Next</button>
                                    </span>
                                </div>
                            )
                        })
                    }
                </span>
                <div className='p-2 overflow-y-auto'>
                    <Description key={questionData.number} title={questionData.title} desc={questionData.desc} tags={[]} />
                </div>
                <div className='w-full h-full'>
                    <Compiler questionNo={setting.index} key={questionData.number} state={code[setting.index]} setState={updateCode} language_id={setting.lang} changeLanguage={changeLanguage} settings={setting} openResultWindow={openResultWindow} closeResultWindow={closeResultWindow} />
                </div>
            </div>
        </div>
    )
}

export default CodeScreen