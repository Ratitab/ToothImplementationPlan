import React, { useState, useEffect } from "react";
import "./index.css"
import { GetUpdateStatus, DownloadNewVersion } from "../../wailsjs/go/main/App"

const CheckAppVersion = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false)
    const [newVersion, setNewVersion] = useState("");

    useEffect(() => {
        const checkUpdateStatus = async () => {
            const [isUpdateAvailable, version] = await GetUpdateStatus();
            console.log("MIDIIS")
            setUpdateAvailable(isUpdateAvailable)
            setNewVersion(version)
        }

        checkUpdateStatus()
    }, [])

    const handleUpdate = async () => {
        try {
            await DownloadNewVersion();
            alert("new version downloaded. please restart the app to apply updates")
        } catch (error) {
            console.error("error downloading new version", error)
            alert("failed to download the new version")
        }
    }

    if (!updateAvailable) {
        return null
    }

    return (
        <div className="update-component">
        <div className="update-content">
          <h2>New Version Available</h2>
          <p>Version {newVersion} is available for download.</p>
          <div className="update-buttons">
            <button className="download-button" onClick={handleUpdate}>
              Download
            </button>
            <button className="dismiss-button" onClick={() => setUpdateAvailable(false)}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    )
}

export default CheckAppVersion