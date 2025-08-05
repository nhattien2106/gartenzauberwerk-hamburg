#!/bin/bash

echo "🚀 Starting Gartenzauberwerk Hamburg..."

# Start backend
echo "🔧 Starting PHP Backend..."
cd /home/ec2-user/work/gartenzauberwerk-hamburg/backend
nohup php -S 0.0.0.0:8000 > /home/ec2-user/backend.log 2>&1 &

# Start frontend
echo "🎨 Starting Next.js Frontend..."
cd /home/ec2-user/work/gartenzauberwerk-hamburg/frontend
nohup npm run dev -- --hostname 0.0.0.0 > /home/ec2-user/frontend.log 2>&1 &

# Get IP address
IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "✅ Application started!"
echo "🌐 Frontend: http://$IP:3000"
echo "🔧 Backend: http://$IP:8000"
echo ""
echo "📝 Logs:"
echo "  Backend: tail -f /home/ec2-user/backend.log"
echo "  Frontend: tail -f /home/ec2-user/frontend.log" 