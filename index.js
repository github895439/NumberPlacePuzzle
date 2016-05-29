function AllocateField_onClick()
{
	gField = new Array(gSizeField);
	
	for (i = 0; i < gSizeField; i++)
	{
		gField[i] = new Array(gSizeField);
	}
	
	document.forms[0].AllocateField.disabled = true;
}

function InitField_onClick()
{
	for (i = 0; i < gSizeField; i++)
	{
		for (j = 0; j < gSizeField; j++)
		{
			gField[i][j] = 0;
		}
	}
	
	posX = 0;
	posY = 0;
	oldX = 0;
	oldY = 0;
	count = 0;
	countAnswer = 0;
	isStop = false;
	isColor = false;
	
	document.forms[0].InitField.disabled = true;
}

function PrintAll_onClick()
{
	isColor = true;
	
	for (i = 0; i < gSizeField; i++)
	{
		for (j = 0; j < gSizeField; j++)
		{
			PrintNumber(j, i);
		}
	}
	
	document.forms[0].PrintAll.disabled = true;
}

function SetQuestion_onClick()
{
	gQuestionField = new Array(gSizeField);
	
	for (i = 0; i < gSizeField; i++)
	{
		gQuestionField[i] = new Array(gSizeField);
	}

	tmpQ = document.forms[0].question.value;
	tmpQ_Line = tmpQ.split("\n");
	
	for (i = 0; i < gSizeField; i++)
	{
		tmpQ_Number = tmpQ_Line[i].split(",");
		
		for (j = 0; j < gSizeField; j++)
		{
			gQuestionField[j][i] = tmpQ_Number[j];
			gField[j][i] = gQuestionField[j][i];
		}
	}

	document.forms[0].SetQuestion.disabled = true;
}

function Reset_onClick()
{
	document.forms[0].AllocateField.disabled = false;
	document.forms[0].InitField.disabled = false;
	document.forms[0].PrintAll.disabled = false;
	document.forms[0].SetQuestion.disabled = false;
	document.forms[0].Analyze.disabled = false;
	document.forms[0].answer.value = "";
}

function ResetColor()
{
	for (i = 0; i < gSizeField; i++)
	{
		for (j = 0; j < gSizeField; j++)
		{
			el = document.getElementById((j + "") + (i + ""));
			el.setAttribute("class", "field_cell");
		}
	}
}

function PrintNumber(x, y)
{
	if (!isColor)
	{
		el = document.getElementById((oldX + "") + (oldY + ""));
		el.setAttribute("class", "field_cell");
	}
	
	el = document.getElementById((x + "") + (y + ""));
	
	if (isColor)
	{
		if (gField[x][y] == 0)
		{
			el.setAttribute("class", "field_cell");
		}
		else
		{
			el.setAttribute("class", "field_cell_" + gField[x][y]);
		}
	}
	else
	{
		el.setAttribute("class", "field_cell_modify");
	}
	
	el.innerText = gField[x][y];
	oldX = x;
	oldY = y;
//	alert("PAUSE " + x + " " + y);
}

function IsValid(x, y, number)
{
	var i;
	var j;
	
	for (i = 0; i < gSizeField; i++)
	{
		if ((gField[x][i] == number) || (gField[i][y] == number))
		{
			return false;
		}
	}
	
	blockX = Math.floor(x / gSizeBlock);
	blockY = Math.floor(y / gSizeBlock);
	
	for (i = 0; i < gSizeBlock; i++)
	{
		for (j = 0; j < gSizeBlock; j++)
		{
			tmpX = blockX * gSizeBlock + j;
			tmpY = blockY * gSizeBlock + i;
			
			if (gField[tmpX][tmpY] == number)
			{
				return false;
			}
		}
	}
	
	return true;
}

function AddAnswer()
{
	var i;
	var j;

	countAnswer++;
	answer = "";
	
	for (i = 0; i < gSizeField; i++)
	{
		for (j = 0; j < gSizeField; j++)
		{
			answer += "" + gField[j][i] + ",";
		}
		
		answer += "\n";
	}
	
	document.forms[0].answer.value += "ANSWER:" + countAnswer + "\n" + answer + "\n";
}

function Recursive(x, y)
{
	var i;
	var tmpX;
	var tmpY;
	var numberMin;
	var numberMax;
	
	numberMin = 1;
	numberMax = gSizeField;
	
	if (gQuestionField[x][y] != 0)
	{
		numberMin = gQuestionField[x][y];
		numberMax = gQuestionField[x][y];
	}
	
	for (i = numberMin; i <= numberMax; i++)
	{
		document.forms[0].count.value = count;
		count++;
		
		if (count % 100000 == 0)
		{
			isColor = true;
			PrintAll_onClick();

			if (confirm("STOP?"))
			{
				isStop = true;
				return;
			}
		}
		
		if ((IsValid(x, y, i)) || (gQuestionField[x][y] != 0))
		{
			tmpX = x;
			tmpY = y;
			gField[tmpX][tmpY] = i;
			PrintNumber(tmpX, tmpY);
			tmpX++;
			
			if (tmpX == gSizeField)
			{
				tmpX = 0;
				tmpY++;
			}
			
			if (tmpY == gSizeField)
			{
				isColor = true;
				PrintAll_onClick();
				AddAnswer();
				
				if (confirm("ANSWER. STOP?"))
				{
					isStop = true;
					return;
				}
				
				ResetColor();
				isColor = false;
			}
			else
			{
				Recursive(tmpX, tmpY);
				
				if (isStop)
				{
					return;
				}
			}
		}
	}
	
	if (gQuestionField[x][y] == 0)
	{
		gField[x][y] = 0;
		PrintNumber(x, y);
	}
}

function Analyze_onClick()
{
	ResetColor();
	isColor = false;
	Recursive(0, 0);
	document.forms[0].Analyze.disabled = true;
}

var gSizeField = 9;
var gSizeBlock = gSizeField / 3;
var gField;
var gQuestionField;
var posX;
var posY;
var oldX;
var oldY;
var count;
var countAnswer;
var isStop;
var isColor;
