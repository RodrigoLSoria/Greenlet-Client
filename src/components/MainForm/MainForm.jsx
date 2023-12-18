import React, { useState } from 'react'
import NewPostForm from '../NewPostForm/NewPostForm'
import NewToolPostForm from '../NewToolPostForm/NewToolPostForm'
import { Button } from 'react-bootstrap'


const MainForm = ({ setShowMainFormModal }) => {

    const [formType, setFormType] = useState(null)
    // TODO stick to the PLANTs, leave the tools for a more advanced stage of the project
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
    )
}

export default MainForm
