# You can optionally override these variable by 
# uncommenting them and setting a value:

# Path to Node Binary (default: node)
#NODE_BIN:=

# List of views to work on (default: automatically found)
# Separate multiple items with a space
#VIEWS:=

# List of folders/views to ignore
# If $(VIEWS) variable is set above, this is ignored
# Separate multiple items with a space
#IGNORE_VIEWS:=

# TRIRIGA Username (default: Read from ../tririga.json)
#TRI_USER:=

# TRIRIGA Password (default: Read from ../tririga.json)
#TRI_PASSWORD:=

# TRIRIGA TRI_URL (default: Read from ../tririga.json)
#TRI_URL:=

# The port for Proxy server to listen on (default: 8001)
#PROXY_PORT := <proxy-server-port>

# View dependencies
# If one view depends on another, declare that relationship here
# Make will then build them in the correct order
#
#   Example: dep_triview-room-reservation:=triapp-reservation-list
#
#dep_<view-name>:=<dependent-view-name>


# Import the actual Makefile from shared location
# This MUST be the last line
include C:/tools/Makefile
