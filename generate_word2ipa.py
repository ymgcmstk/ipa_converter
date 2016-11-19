#!/usr/bin/env python
# -*- coding:utf-8 -*-

from mytoolbox import *
import json
import sys
from subprocess import check_output

WORD_LIST = 'google-10000-english/google-10000-english-usa.txt'
JSON_PATH = 'word2ipa.json'

DICTIONARY = None
OFFSET = 0

REPLACER = {'ɪ':'i', 'ɛ':'e', 'ʊ':'u'}

def convert_word_to_ipa(word):
    ipa = check_output(['espeak', '-q', '--ipa',
                        '-v', 'en-us',
                        word])[:-1]
    for k, v in REPLACER.iteritems():
        ipa = ipa.replace(k, v)
    return ipa

def main():
    words = textread(WORD_LIST)
    word2ipa = {}
    for word_i in tictoc(range(len(words))):
        cur_word = words[word_i]
        try:
            word2ipa[cur_word] = convert_word_to_ipa(cur_word)
        except IndexError as e:
            continue
    jsondump(JSON_PATH, word2ipa)
    return

if __name__ == '__main__':
    main()
