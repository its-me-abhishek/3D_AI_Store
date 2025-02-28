import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, getContrastingColor, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import Select from 'react-select';

const Customizer = () => {
    const snap = useSnapshot(state);

    const [file, setFile] = useState('');

    const [prompt, setPrompt] = useState('');
    const [generatingImg, setGeneratingImg] = useState(false);

    const [activeEditorTab, setActiveEditorTab] = useState("");
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false,
    })

    // show tab content depending on the activeTab
    const generateTabContent = () => {
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker />
            case "filepicker":
                return <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                />
            case "aipicker":
                return <AIPicker
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />
            default:
                return null;
        }
    }

    const handleSubmit = async (type) => {
        if (!prompt) return alert("Please enter a prompt");

        try {
            setGeneratingImg(true);

            const response = await fetch('http://localhost:8080/api/v1/dalle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                })
            })

            const data = await response.json();

            handleDecals(type, `data:image/png;base64,${data.photo}`)
        } catch (error) {
            alert(error)
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab("");
        }
    }

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result;

        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab)
        }
    }

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[tabName];
                break;
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName];
                break;
            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
                break;
        }

        // after setting the state, activeFilterTab is updated

        setActiveFilterTab((prevState) => {
            return {
                ...prevState,
                [tabName]: !prevState[tabName]
            }
        })
    }

    const options = [
        { value: "Shirt", label: "Shirt" },
        { value: "Sweatshirt", label: "Sweatshirt" },
        { value: "Shoe", label: "Shoe" }
    ];

    const readFile = (type) => {
        reader(file)
            .then((result) => {
                handleDecals(type, result);
                setActiveEditorTab("");
            })
    }

    const handleEditorTabClick = (tabName) => {
        setActiveEditorTab(prevTab => prevTab === tabName ? "" : tabName);
    }

    const handleModelChange = (selectedOption) => {
        state.selectedModel = selectedOption.value;
    };

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key="custom"
                        className="absolute top-0 left-0 z-10"
                        {...slideAnimation('left')}
                    >
                        <div className="flex items-center min-h-screen">
                            <div className="editortabs-container tabs">
                                {EditorTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => handleEditorTabClick(tab.name)}
                                    />
                                ))}
                                {generateTabContent()}
                                <CustomButton
                                    type="filled"
                                    title="<- Go Back"
                                    handleClick={() => state.intro = true}
                                    customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className='filtertabs-container'
                        {...slideAnimation("up")}
                    >   <div style={{ display: 'flex', height: 55, justifyContent: 'center', marginTop: '0' }}>
                            <Select
                                options={options}
                                onChange={handleModelChange}
                                value={options.find((option) => option.value === snap.selectedModel)}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: snap.color,
                                        color: getContrastingColor(snap.color),
                                        border: "2px solid #ccc",
                                        borderRadius: "5px",
                                        padding: "5px",
                                        width: "200px",
                                        cursor: "pointer",
                                        transition: "border-color 0.3s, box-shadow 0.3s",
                                        "&:hover": { borderColor: "#888" },
                                        "&:focus": { boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)" },
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: getContrastingColor(snap.color),
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        minWidth: "max-content",
                                    }),
                                }}
                            />
                        </div>
                        {FilterTabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleClick={() => handleActiveFilterTab(tab.name)}
                            />
                        ))}

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Customizer;
