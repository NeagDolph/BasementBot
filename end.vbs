set shell=createobject("wscript.shell")
dim cmdline
cmdline="C:\""Program Files""\nodejs\node.exe" ' HERE
set wmi=getobject("winmgmts:{impersonationLevel=impersonate}!\\"&shell.expandenvironmentstrings("%computername%")&"\root\cimv2")
for each process in wmi.instancesof("Win32_process")
if process.name="node.exe" and instr(process.commandline,cmdline)>0 then
process.terminate
end if next