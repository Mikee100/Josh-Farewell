# Script to remove half of images from family_images and friends_images folders
# This improves performance by reducing the number of images to load

Write-Host "Starting image reduction process..."

# Function to remove half of images from a folder
function Remove-HalfOfImages {
    param(
        [string]$Folder
    )

    $fullPath = Join-Path (Get-Location) $Folder
    if (-not (Test-Path $fullPath)) {
        Write-Host "Folder not found: $fullPath"
        return
    }

    # Get all image files (jpg, jpeg, png, heic, HEIC, JPG, JPEG, PNG)
    $files = Get-ChildItem $fullPath -File -Include *.jpg,*.jpeg,*.png,*.heic,*.HEIC,*.JPG,*.JPEG,*.PNG |
             Sort-Object Name

    $count = $files.Count
    if ($count -le 1) {
        Write-Host "Not enough image files in $Folder to reduce (count = $count)"
        return
    }

    $half = [math]::Floor($count / 2)

    # Keep first half, remove second half
    $toRemove = $files | Select-Object -Skip $half

    Write-Host "Removing $($toRemove.Count) images from $Folder (keeping $half images)..."
    foreach ($f in $toRemove) {
        Remove-Item -LiteralPath $f.FullName -Force
        Write-Host "  Removed: $($f.Name)"
    }

    Write-Host "Done with $Folder. Remaining images: $half"
}

# Remove half of the images for better performance
Write-Host "`nProcessing family_images folder..."
Remove-HalfOfImages -Folder "family_images"

Write-Host "`nProcessing friends_images folder..."
Remove-HalfOfImages -Folder "friends_images"

Write-Host "`nImage reduction complete!"

