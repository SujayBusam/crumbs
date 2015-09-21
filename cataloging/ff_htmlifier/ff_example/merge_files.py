import os
import shutil

for directory in next(os.walk('.'))[1]:
  shutil.copyfile(directory + '/items.txt',
    '/Users/SujayBusam/Dropbox/Programming/Crumbs/fastfood-items/' + directory + '.txt')
