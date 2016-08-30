<?php
/**
 * Simple zip helper for preparing bundles and such.
 */
class ZipHelper
{
	const FILE_EXCLUSION_PATTERN = '#\.lnk$#';

	public static function zipDir($sourceDir, $zipFileName)
	{
		// Get real path for our folder
		$rootPath = realpath($sourceDir);

		// Initialize archive object
		$zip = new ZipArchive();
		$zip->open($zipFileName, ZipArchive::CREATE | ZipArchive::OVERWRITE);

		// Create recursive directory iterator
		/** @var SplFileInfo[] $files */
		$files = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator($rootPath),
			RecursiveIteratorIterator::LEAVES_ONLY
		);

		foreach ($files as $name => $file)
		{
			// Skip directories (they would be added automatically)
			if (!$file->isDir())
			{
				// excluded files/extensions (note SplFileInfo::getExtension only in PHP >= 5.3.6)
				if (preg_match(self::FILE_EXCLUSION_PATTERN, $file->getFilename())) {
					continue;
				}

				// Get real and relative path for current file
				$filePath = $file->getRealPath();
				$relativePath = substr($filePath, strlen($rootPath) + 1);

				// Add current file to archive
				$zip->addFile($filePath, $relativePath);
			}
		}

		// Zip archive will be created only after closing object
		$zip->close();
	}
}