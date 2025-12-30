import { motion } from 'framer-motion';
import { History, Dog, Loader2, InfoIcon } from 'lucide-react';

export const HistoryList = ({ history, loading, hasMore, infiniteScrollRef }) => (
  <div className="mt-12">
    <div className="flex items-center gap-2 mb-4 px-2">
      <History className="w-5 h-5 text-slate-400" />
      <h3 className="font-semibold">Recent Analyses</h3>
    </div>
    
    <div className="flex flex-col gap-3">
      {history.map((item, idx) => (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          key={item.id} 
          className="glass p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Dog className="w-6 h-6 text-slate-400 group-hover:text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">{item.animal}</h4>
              <p className="text-xs text-slate-400">{item.breed} • {item.bodyType}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-white text-sm">{item.estimatedWeight}kg</p>
            <p className="text-[10px] text-slate-500">
              {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}
            </p>
          </div>
        </motion.div>
      ))}
      
      {hasMore && (
        <div ref={infiniteScrollRef} className="py-8 flex justify-center">
          {loading && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
        </div>
      )}

      {!hasMore && history.length > 0 && (
        <p className="text-center text-xs text-slate-600 py-6">End of history</p>
      )}

      {history.length === 0 && !loading && (
        <div className="text-center py-12 glass rounded-3xl opacity-50 border-dashed border-2 border-white/5">
          <InfoIcon className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          <p className="text-sm">No recent data</p>
        </div>
      )}
    </div>
  </div>
);
