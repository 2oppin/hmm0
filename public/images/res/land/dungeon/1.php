<?php
$dir = glob('./*.*');

var_dump($dir);

rename($dir[0], '0_'.basename($dir[0]));
