import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import PageTitle from "../../../layouts/PageTitle";

class CkEditor extends Component {
    render() {
        return (
            <>
                <PageTitle activeMenu="CkEditor" motherMenu="Form" pageContent="CkEditor" />
                <div class="row">
                    <div class="col-xl-12 col-xxl-12">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="card-title">Form CkEditor</h4>
                            </div>
                            <div class="card-body custom-ekeditor">
                                <CKEditor
                                    editor={ ClassicEditor }
                                    onReady={ editor => {
                                        // console.log( 'Editor is ready to use!', editor );
                                    } }
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        // console.log( { event, editor, data } );
                                    } }
                                    onBlur={ ( event, editor ) => {
                                        // console.log( 'Blur.', editor );
                                    } }
                                    onFocus={ ( event, editor ) => {
                                        // console.log( 'Focus.', editor );
                                    } }
                                />
                            </div>
                        </div>
                    </div>        
                </div>        
            </>
        );
    }
}

export default CkEditor;