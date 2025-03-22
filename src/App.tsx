import React, { useState, useCallback } from 'react';
import { Moon, Sun, FileUp, FileDown, Download, Archive, Package, Folder, Check } from 'lucide-react';
import JSZip from 'jszip';
import { FileDropzone } from './components/FileDropzone';
import { ProgressBar } from './components/ProgressBar';
import { TabButton } from './components/TabButton';
import { useDarkMode } from './hooks/useDarkMode';

type Mode = 'compress' | 'decompress';
type ExtractedFile = { name: string; url: string; selected?: boolean };

function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [mode, setMode] = useState<Mode>('compress');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [bundleUrl, setBundleUrl] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [selectMode, setSelectMode] = useState(false);

  const handleCompress = async (files: File[]) => {
    if (!files.length || isProcessing) return;

    setIsProcessing(true);
    setStatus('Compressing files...');
    setProgress(0);

    try {
      const zip = new JSZip();
      
      // Get folder name from the first file's path
      const folderName = files[0].webkitRelativePath ? 
        files[0].webkitRelativePath.split('/')[0] : 
        'compressed';
      
      // Process files and maintain folder structure
      for (const file of files) {
        const relativePath = file.webkitRelativePath || file.name;
        zip.file(relativePath, file);
      }

      // Generate zip with progress updates
      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      }, (metadata) => {
        setProgress(Math.round(metadata.percent));
      });

      // Create download link with folder name
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.bnd`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus('Compression complete!');
      setProgress(100);
    } catch (error) {
      setStatus('Error during compression');
      console.error('Compression error:', error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setStatus('');
      }, 2000);
    }
  };

  const handleDecompress = async (files: File[]) => {
    if (!files.length || isProcessing) return;
    const file = files[0];
    if (!file.name.endsWith('.bnd')) {
      setStatus('Please select a .bnd file');
      return;
    }

    setIsProcessing(true);
    setStatus('Decompressing file...');
    setProgress(0);
    setExtractedFiles([]);
    setBundleUrl(null);
    setOriginalFileName(file.name.replace('.bnd', ''));
    setSelectMode(false);

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const extractedUrls: ExtractedFile[] = [];
      
      let processed = 0;
      const total = Object.keys(content.files).length;

      for (const [filename, zipEntry] of Object.entries(content.files)) {
        if (!zipEntry.dir) {
          const blob = await zipEntry.async('blob');
          const url = URL.createObjectURL(blob);
          extractedUrls.push({ name: filename, url, selected: false });
        }
        processed++;
        setProgress(Math.round((processed / total) * 100));
      }

      setExtractedFiles(extractedUrls);
      
      // Create bundle URL for "Download All"
      const bundleZip = new JSZip();
      for (const file of extractedUrls) {
        const response = await fetch(file.url);
        const blob = await response.blob();
        bundleZip.file(file.name, blob);
      }
      const bundleBlob = await bundleZip.generateAsync({ type: 'blob' });
      setBundleUrl(URL.createObjectURL(bundleBlob));

      setStatus('Decompression complete!');
      setProgress(100);
    } catch (error) {
      setStatus('Error during decompression');
      console.error('Decompression error:', error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 2000);
    }
  };

  const handleDownload = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleSelectFile = useCallback((index: number) => {
    setExtractedFiles(prev => 
      prev.map((file, i) => 
        i === index ? { ...file, selected: !file.selected } : file
      )
    );
  }, []);

  const handleDownloadSelected = useCallback(async () => {
    const selectedFiles = extractedFiles.filter(file => file.selected);
    if (selectedFiles.length === 0) return;

    const zip = new JSZip();
    for (const file of selectedFiles) {
      const response = await fetch(file.url);
      const blob = await response.blob();
      zip.file(file.name, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    handleDownload(url, `${originalFileName}_selected.zip`);
    URL.revokeObjectURL(url);
  }, [extractedFiles, originalFileName, handleDownload]);

  const clearExtractedFiles = useCallback(() => {
    extractedFiles.forEach(file => URL.revokeObjectURL(file.url));
    if (bundleUrl) {
      URL.revokeObjectURL(bundleUrl);
      setBundleUrl(null);
    }
    setExtractedFiles([]);
    setOriginalFileName('');
    setSelectMode(false);
  }, [extractedFiles, bundleUrl]);

  const toggleSelectMode = useCallback(() => {
    setSelectMode(prev => !prev);
    if (!selectMode) {
      setExtractedFiles(prev => prev.map(file => ({ ...file, selected: false })));
    }
  }, [selectMode]);

  const selectedCount = extractedFiles.filter(file => file.selected).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white text-center sm:text-left">
            NFH archiver
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-6">
          <TabButton
            icon={Archive}
            label="Compress"
            isActive={mode === 'compress'}
            onClick={() => {
              setMode('compress');
              clearExtractedFiles();
            }}
          />
          <TabButton
            icon={FileDown}
            label="Decompress"
            isActive={mode === 'decompress'}
            onClick={() => {
              setMode('decompress');
              clearExtractedFiles();
            }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center mb-4">
            {mode === 'compress' ? (
              <FileUp className="w-5 h-5 text-blue-500 mr-2" />
            ) : (
              <FileDown className="w-5 h-5 text-green-500 mr-2" />
            )}
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              {mode === 'compress' ? 'Compress Files' : 'Decompress .bnd'}
            </h2>
          </div>

          <FileDropzone
            onFilesDrop={mode === 'compress' ? handleCompress : handleDecompress}
            accept={mode === 'compress' ? {
              'application/*': [],
              'image/*': [],
              'text/*': [],
            } : {
              'application/x-zip-compressed': ['.bnd'],
            }}
            description={mode === 'compress' 
              ? 'Drop files or folders to compress' 
              : 'Drop a .bnd file to decompress'
            }
          />

          {/* Progress Section */}
          {(isProcessing || status) && (
            <div className="mt-5">
              <ProgressBar progress={progress} status={status} />
            </div>
          )}

          {/* Extracted Files Section */}
          {mode === 'decompress' && extractedFiles.length > 0 && (
            <div className="mt-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-white">
                    Extracted Files
                  </h3>
                  <button
                    onClick={toggleSelectMode}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {selectMode ? 'Cancel Selection' : 'Select Files'}
                  </button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {selectMode && selectedCount > 0 && (
                    <button
                      onClick={handleDownloadSelected}
                      className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Download Selected ({selectedCount})
                    </button>
                  )}
                  {bundleUrl && (
                    <button
                      onClick={() => handleDownload(bundleUrl, `${originalFileName}.zip`)}
                      className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                      <Package className="w-4 h-4 mr-1.5" />
                      Download All
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                {extractedFiles.map((file, index) => (
                  <div
                    key={file.name}
                    className={`flex items-center justify-between p-2 bg-slate-50 dark:bg-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-100 dark:hover:bg-gray-600 ${
                      selectMode && file.selected ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => selectMode && handleSelectFile(index)}
                    role={selectMode ? 'button' : undefined}
                  >
                    <div className="flex items-center flex-1 min-w-0 gap-2">
                      {selectMode && (
                        <div className={`w-4 h-4 rounded border ${
                          file.selected 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300 dark:border-gray-500'
                        } flex items-center justify-center`}>
                          {file.selected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      )}
                      <span className="text-sm text-slate-700 dark:text-gray-300 truncate">
                        {file.name}
                      </span>
                    </div>
                    {!selectMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file.url, file.name);
                        }}
                        className="flex items-center px-2 py-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 shrink-0"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;