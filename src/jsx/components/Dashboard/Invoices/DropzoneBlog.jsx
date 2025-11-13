import React, { useState } from "react";
import {Link} from 'react-router-dom';


import Dropzone from "react-dropzone";

function DropzoneBlog() {
	const [fileNames, setFileNames] = useState([]);
	const [searchBut, setSearchBut	] = useState(true);
	const handleDrop = acceptedFiles =>
		setFileNames(acceptedFiles.map(file => file.name));

	return (
		<div className="App">
			<Dropzone onDrop={handleDrop}>
				{({ getRootProps, getInputProps }) => (
					<div {...getRootProps({ className: "dropzone" })}>
						<input {...getInputProps()} />							
						<div className="dropzone-panel mb-lg-0 mb-2">
							<Link to={"#"} className="dropzone-select btn btn-primary light font-weight-bold btn-lg">
								<div className="d-flex upload-btn">
									<i className="fas fa-cloud-upload-alt me-3"></i>
									<div>
										<span className="fs-18 font-w600 d-block text-primary text-start">Upload Files</span>
										<span className="text-primary">PDF, DOC, PPT, JPG, PNG</span>
									</div>
								</div>
							</Link>
						</div>
					</div>
				)}
			</Dropzone>
			<div>
				{fileNames.map(fileName => (
					<div className="dropzone-items">
						<div className={`dropzone-item ${searchBut ? "" : "d-none"}`}>
							<div className="file-icon">
								<i className="fas fa-file-alt me-3"></i>
							</div>
							<div className="dropzone-file">
								<div className="dropzone-filename" title="some_image_file_name.jpg">
									<p data-dz-name="" className="fs-18 font-w600 mb-0" key={fileName}>{fileName}</p>
									<span data-dz-size="" className="fs-16 font-w600 text-primary">340 KB</span>
								</div>
								<div className="dropzone-error" data-dz-errormessage=""></div>
							</div>
							<div className="dropzone-progress">
								<div className="progress">
									<div className="progress-bar bg-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-dz-uploadprogress=""></div>
								</div>
							</div>
							<div className="dropzone-toolbar" >
								<span className="dropzone-delete" data-dz-remove="" onClick={() => setSearchBut(!searchBut)}> 
									<i className="fas fa-times"></i>
								</span>
							</div>
						</div>
					</div> 
				))}
				
			</div>
		</div>
	);
}
export default DropzoneBlog;