# Script to remove gallery items from HTML for images that no longer exist

$htmlFile = "index.html"
$htmlContent = Get-Content $htmlFile -Raw

# Get existing image files
$familyImages = Get-ChildItem "family_images" -File -Include *.jpg,*.jpeg,*.png,*.JPG,*.JPEG,*.PNG | ForEach-Object { $_.Name }
$friendsImages = Get-ChildItem "friends_images" -File -Include *.jpg,*.jpeg,*.png,*.JPG,*.JPEG,*.PNG | ForEach-Object { $_.Name }

Write-Host "Found $($familyImages.Count) family images"
Write-Host "Found $($friendsImages.Count) friends images"

# Function to check if image exists and remove gallery item if it doesn't
function Remove-MissingImageItems {
    param(
        [string]$html,
        [string]$folder,
        [array]$existingFiles
    )
    
    # Pattern to match gallery items for this folder
    $pattern = "(?s)<div class=`"gallery-item`" data-category=`"$folder`".*?data-image=`"[`"']?.*?$folder/([^`"']+)`".*?</div>\s*"
    
    $matches = [regex]::Matches($html, $pattern)
    $removedCount = 0
    
    foreach ($match in $matches) {
        $filename = $match.Groups[1].Value
        # Normalize path separators
        $filename = $filename -replace '/', '\'
        $filename = $filename -replace '\\', '\'
        
        # Check if file exists
        if ($filename -notin $existingFiles) {
            Write-Host "Removing missing image: $filename"
            $html = $html -replace [regex]::Escape($match.Value), ""
            $removedCount++
        }
    }
    
    Write-Host "Removed $removedCount items for $folder folder"
    return $html
}

# Remove missing family images
$htmlContent = Remove-MissingImageItems -html $htmlContent -folder "family" -existingFiles $familyImages

# Remove missing friends images  
$htmlContent = Remove-MissingImageItems -html $htmlContent -folder "friends" -existingFiles $friendsImages

# Save updated HTML
$htmlContent | Set-Content $htmlFile -NoNewline
Write-Host "`nCleanup complete! Updated $htmlFile"


