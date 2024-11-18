import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { LuLoader2 } from "react-icons/lu";

interface CompilerProps {
    language_id: string;
    state: any;
    setState: Function;
    changeLanguage: Function;
    settings: any;
    openResultWindow: Function;
    closeResultWindow: Function;
    questionNo: number;
}


const Compiler: React.FC<CompilerProps> = ({ language_id, state, setState, changeLanguage, settings, openResultWindow, closeResultWindow, questionNo }) => {


    // Function to get language name
    function getLanguageName(id: string) {
        if (id === "62") {
            return "Java";
        } else if (id === "71") {
            return "Python";
        } else if (id === "50") {
            return "C";
        } else if (id === "54") {
            return "C++";
        }
        return "Please select a language";
    }


    // Dummy test result should be replaced by state testResult in future. (testResult:Array<Object<success:boolean>>)
    const [testResult, setTestResult] = useState({
        result: [
            {
                success: true,
            },
            {
                success: true,
            },
            {
                success: false,
            },
            {
                success: true,
            },
            {
                success: true,
            },
            {
                success: false
            },
            {
                success: false
            },
        ],
        loader: true
    });

    function setTestResultData(data: Array<any>) {
        setTestResult({
            ...testResult,
            result: data
        })
    }

    function startLoader() {
        setTestResult({
            ...testResult,
            loader: true
        })
    }

    function stopLoader() {
        setTestResult({
            ...testResult,
            loader: false
        })
    }



    function customFieldOpen() {
        const customWindow = document.getElementById('customWindow');
        if (customWindow) {
            customWindow.classList.remove('hidden');
        }
    }

    function customFieldClose() {
        const customWindow = document.getElementById('customWindow');
        if (customWindow) {
            customWindow.classList.add('hidden');
        }
    }


    async function runCode() {
        try {
            startLoader();
            openResultWindow();
            customFieldClose();
            // const response = await fetch();
            // const {result} = await response.json();
            // setTestResultData(result);
        } catch (error) {

        } finally {
            setTimeout(() => {
                stopLoader();
            }, 1500);
        }
    }

    return (
        <div className='p-2 w-full'>
            <nav className='bg-white h-[30px] rounded-t-md items-center p-1 justify-end w-full flex'>
                <select onChange={(e) => changeLanguage(e.target.value)}>
                    {
                        settings.availableLang.map((lang: string) => {
                            return (
                                <option key={lang} value={lang}>{getLanguageName(lang)}</option>
                            )
                        })
                    }
                </select>
            </nav>
            <CodeMirror
                onChange={(value, viewUpdate) => {
                    if (language_id === "62") {
                        setState(questionNo, 'java', value);
                    } else if (language_id === "71") {
                        setState(questionNo, 'python', value);
                    } else if (language_id === "50") {
                        setState(questionNo, 'c', value);
                    } else if (language_id === "54") {
                        setState(questionNo, 'cpp', value);
                    }
                }}
                value={
                    language_id === "62"
                        ? state.java
                        : language_id === "71"
                            ? state.python
                            : language_id === "50"
                                ? state.c
                                : state.cpp
                }
                height="60vh"
                theme={dracula}
                extensions={
                    language_id === "62"
                        ? [java().language]
                        : language_id === "71"
                            ? [python().language]
                            : [cpp().language]
                }
            />
            <div id="footer" className='bg-white relative z-0 h-[50px] rounded-b-md items-center p-1 justify-end w-full flex'>
                <button onClick={() => customFieldOpen()} className='mr-2 text-black  py-1 px-3 w-fit font-semibold rounded-md'>Custom Input</button>
                <button onClick={() => runCode()} className='mr-2 text-black border border-black py-1 px-3 w-fit font-semibold rounded-md'>Run</button>
                <button onClick={() => openResultWindow()} className='mr-2 text-white bg-black border border-black py-1 px-3 w-fit font-semibold rounded-md'>Submit</button>
                {settings.testWindowSize > 0 &&
                    <>
                        <span style={{ minHeight: `${settings.testWindowSize}vh` }} className={`bg-white overflow-y-auto justify-start items-start absolute bottom-0 left-0 border z-10 border-black ${settings.testWindowSize <= 0 && 'hidden'} h-full w-full flex`}>
                            <button onClick={() => closeResultWindow()} className='bg-white rounded-full p-1 w-5 h-5 absolute top-0 border border-black flex items-center justify-center right-0 shadow-sm'><RxCross2 color='black' /></button>
                            {
                                testResult.loader ?
                                    <div className='h-full w-full flex flex-col items-center justify-center'>
                                        <LuLoader2 size={30} className='animate-spin' />
                                        <p>Please wait, submission in progress (Queued)</p>
                                    </div>
                                    :
                                    <div className='flex-wrap gap-2 flex items-start justify-start w-full h-full'>
                                        {
                                            testResult.result.map((result: any, index: number) => {
                                                return (
                                                    <TestCase testCase={index + 1} success={result.success} />
                                                )
                                            })
                                        }
                                    </div>
                            }
                        </span>
                    </>
                }
                <span id="customWindow" style={{ minHeight: `30vh` }} className={`bg-white hidden overflow-y-auto justify-start items-start absolute bottom-0 left-0 border z-10 border-black h-full w-full flex`}>
                    <button onClick={() => customFieldClose()} className='bg-white rounded-full p-1 w-5 h-5 absolute top-0 border border-black flex items-center justify-center right-0 shadow-sm'><RxCross2 color='black' /></button>
                    <div className='p-2 w-full'>
                        <p>Custom Input</p>
                        <textarea className='w-full p-2 outline-none h-36 border border-black rounded-md '></textarea>
                        <div className='w-full items-end justify-end flex'>
                            <button onClick={() => runCode()} className='mr-2 text-black border border-black pt-1 px-3 w-fit font-semibold rounded-md'>Run</button>
                        </div>
                    </div>
                </span>
            </div>
        </div>
    );

}



const TestCase = ({ testCase, success }: { testCase: number, success: boolean }) => {

    return (
        <p className={` flex items-center bg-transparent py-1 px-3 w-fit ${success ? 'text-green-600' : 'text-red-600'}`}>
            {success ? <IoMdCheckmarkCircleOutline /> : <RxCross2 />}
            Test Case {testCase}
        </p>
    )
}

export default Compiler;
