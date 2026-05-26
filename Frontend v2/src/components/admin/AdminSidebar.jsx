const NAV_ITEMS = [
    { key: 'stats',     label: 'Statistiques', icon: '📊' },                                                                                          
    { key: 'epreuves',  label: 'Épreuves',     icon: '📂' },                                                                                          
    { key: 'filieres',  label: 'Filières',     icon: '🏫' },
    { key: 'etudiants', label: 'Étudiants',    icon: '👥' },                                                                                          
  ]                                                                                                                                                   
                                                                                                                                                      
  export default function AdminSidebar({ activeSection, onNavigate }) {                                                                               
    return (      
      <aside className="fixed left-0 top-16 bottom-0 w-52 bg-white shadow-sm z-20 overflow-y-auto">
        <div className="py-4">                                                                                                                        
          <p className="text-xs font-semibold text-gray-400 uppercase px-5 mb-3 tracking-wider">Menu</p>                                              
          {NAV_ITEMS.map(item => (                                                                                                                    
            <div                                                                                                                                      
              key={item.key}                                                                                                                          
              onClick={() => onNavigate(item.key)}                                                                                                    
              className={`flex items-center gap-3 px-5 py-3 cursor-pointer text-sm font-medium transition hover:bg-blue-50
                ${activeSection === item.key                                                                                                          
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-600'}`}                                                                                                                
            >     
              <span className="text-lg">{item.icon}</span>                                                                                            
              {item.label}                                                                                                                            
            </div>
          ))}                                                                                                                                         
        </div>    
      </aside>
    )
  }