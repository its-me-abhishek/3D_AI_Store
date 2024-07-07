import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from '../config/motion'
import CustomButton from '../components/CustomButton';

const Home = () => {
    const snap = useSnapshot(state);

    return (
        <AnimatePresence>
            {snap.intro && (
                <motion.section className='home' {...slideAnimation('left')}>
                    <motion.header {...slideAnimation('down')}>
                        <img src='./threejs.png'
                            alt='logo'
                            className='w-8 h-8 object-contain' />
                    </motion.header>
                    <motion.div className='home-content' {...headContainerAnimation}>
                        <h1 className='head-text'
                            style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                        >
                            3D SHOP
                        </h1>
                    </motion.div>
                    <motion.div className='flex flex-col gap-5 ' {...headContainerAnimation}>
                        <p className='max-w-md font-normal text-white text-shadow-custom'
                            style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                        >
                            Welcome to 3D SHOP, where creativity meets technology.
                            Customize your unique and exclusive t-shirts using our innovative 3D customization tool.
                            <br />
                            <strong>Unleash your imagination</strong> and design apparel that stands out from the crowd.
                        </p>
                        <CustomButton
                            type='filled'
                            title='Customize now'
                            handleClick={() => state.intro = false}
                            customStyles='w-fit px-4 py-2.5 font-bold text-sm' />
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default Home