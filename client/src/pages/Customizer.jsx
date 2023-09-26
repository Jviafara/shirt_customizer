import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import { useState } from 'react';
import { download } from '../assets';
import {
    AIPicker,
    ColorPicker,
    CustomButton,
    FilePicker,
    Tab,
} from '../components';
import config from '../config/config';
import { DecalTypes, EditorTabs, FilterTabs } from '../config/constants';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { fadeAnimation, slideAnimation } from '../config/motion';
import state from '../store';

const Customizer = () => {
    const snap = useSnapshot(state);
    const [file, setFile] = useState('');
    const [promp, setPromp] = useState('');
    const [generatingImg, setGeneratingImg] = useState(false);
    const [actieEdiotorTab, setActieEdiotorTab] = useState('');
    const [activeFiltertab, setActiveFiltertab] = useState({
        logoShirt: true,
        stilesShirt: false,
    });

    //SHOW ACTIVE TAB
    const generateTabContent = () => {
        switch (actieEdiotorTab) {
            case 'colorpicker':
                return <ColorPicker />;
            case 'filepicker':
                return (
                    <FilePicker
                        file={file}
                        setFile={setFile}
                        readFile={readFile}
                    />
                );
            case 'aipicker':
                return <AIPicker />;
            default:
        }
    };

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result;

        if (!activeFiltertab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab);
        }
    };

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case 'logo':
                state.isLogoTexture = !activeFiltertab[tabName];
                break;
            case 'styleShirt':
                state.isFullTexture = !activeFiltertab[tabName];
                break;

            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
        }
    };

    const readFile = () => {
        reader(file).then((result) => {
            handleDecals(type, result);
            setActieEdiotorTab('');
        });
    };

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key="custom"
                        className="absolute  top-0 left-0 z-10"
                        {...slideAnimation('left')}>
                        <div className="flex items-center min-h-screen">
                            <div className="editortabs-container tabs">
                                {EditorTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() =>
                                            setActieEdiotorTab(tab.name)
                                        }
                                    />
                                ))}
                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="absolute z-10 top-5 right-5"
                        {...fadeAnimation}>
                        <CustomButton
                            type={'filled'}
                            title={'Go BAck'}
                            handleClick={() => (state.intro = true)}
                            customStyles={'w-fit px-4 py-2.5 font-bold text-sm'}
                        />
                    </motion.div>
                    <motion.div
                        className="filtertabs-container"
                        {...slideAnimation('up')}>
                        {FilterTabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab=""
                                handleClick={() => {}}
                            />
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Customizer;
