import React, { useState } from 'react';
import NewPostForm from '../NewPostForm/NewPostForm'; // Your existing plant form component
import NewToolPostForm from '../NewToolPostForm/NewToolPostForm'; // The new tool form component
import { Button } from 'react-bootstrap';

const MainForm = ({ showMainFormModal, setShowMainFormModal }) => {
    const [formType, setFormType] = useState(null);

    return (
        <div>
            {formType === null &&
                <>
                    <h3>What do you want to post?</h3>
                    <Button onClick={() => setFormType('plants')}>Plants</Button>
                    <Button onClick={() => setFormType('tools')}>Tools</Button>
                </>
            }


            {
                formType === 'plants' && (
                    <NewPostForm setShowMainFormModal={setShowMainFormModal} />
                )}
            {
                formType === 'tools' && (
                    <NewToolPostForm setShowMainFormModal={setShowMainFormModal} />
                )}
        </div>
    );
};

export default MainForm;
