
    var timeDefault=[30,60,90,120,180,360,720,1080];
    //时间轴列表循环
    function forList(data){
        $(".timeLine").html("");
        var timeHtml="";
        var liSize=data.length;
        if(liSize<8){
            for(i=0;i<liSize;i++){
                timeHtml+="<li flag="+i+">"+
                "<dl>"+
                    "<dt>"+data[i]+"</dt>"+
                    "<dd>"+
                        "<span class='arrow-up'></span>"+
                        "<span class='arrow-down'></span>"+
                    "</dd>"+
                "</dl>"+
                "</li>"
            }
        }else{
            for(i=0;i<liSize-1;i++){
                timeHtml+="<li flag="+i+">"+
                "<dl>"+
                    "<dt>"+data[i]+"</dt>"+
                    "<dd>"+
                        "<span class='arrow-up'></span>"+
                        "<span class='arrow-down'></span>"+
                    "</dd>"+
                "</dl>"+
                "</li>"
            }
            timeHtml+="<li flag="+i+">"+
                "<dl style='border:none;background:#ecf6fd'>"+
                    "<dt>"+data[i]+"</dt>"+
                "</dl>"+
                "</li>"
        }
        
        $(".timeLine").html(timeHtml);
    }
    //默认展示
    forList(timeDefault);

    //添加列表
    $(document).on('click','#btn-add',function(){
        var size=timeDefault.length;
        switch (size){
            case 1:
                timeDefault.push(60);
                break;
            case 2:
                timeDefault.push(90);
                break;
            case 3:
                timeDefault.push(120);
                break;
            case 4:
                timeDefault.push(180);
                break;
            case 5:
                timeDefault.push(360);
                break;
            case 6:
                timeDefault.push(720);
                break;
            case 7:
                timeDefault.push(1080);
                break;
            default:
                ufma.showTip('注意：已经达到最大天数！', function () {}, 'warning');
                break;
        }
        forList(timeDefault);
    });
    //删除列表
    $(document).on('click','#btn-del',function(){
        if(timeDefault.length>1){
            timeDefault.pop();
        }else{
            ufma.showTip('注意：已经达到最小天数！', function () {}, 'warning');
        }
        forList(timeDefault);
    })

    //鼠标点击某个点
    $(document).on('click','.timeLine li',function(){
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");
    })

    //计数器区间判断方法
    function numSwitch(flag,num,tag){
        switch(flag){
            case '0':
                if(tag==1){
                    if(num>=59){
                        return num;
                    }else{
                        return (++num);
                    }
                }else{
                    if(num<=30){
                        return num;
                    }else{
                        return (--num);
                    }
                }
                break;
            case '1':
                if(tag==1){
                    if(num>=89){
                        return num;
                    }else{
                        return (++num);
                    }
                }else{
                    if(num<=60){
                        return num;
                    }else{
                        return (--num);
                    }
                }
                break;
            case '2':
                if(tag==1){
                    if(num>=119){
                        return num;
                    }else{
                        return (++num);
                    }
                }else{
                    if(num<=90){
                        return num;
                    }else{
                        return (--num);
                    }
                }
                break;
            case '3':
                if(tag==1){
                    if(num>=179){
                        return num;
                    }else{
                        return (++num);
                    }
                }else{
                    if(num<=120){
                        return num;
                    }else{
                        return (--num);
                    }
                }
                break;
            case '4':
                if(tag==1){
                    if(num>=359){
                        return num;
                    }else{
                        return (++num);
                    }
                }else{
                    if(num<=180){
                        return num;
                    }else{
                        return (--num);
                    }
                }
                break;
            case '5':
                if(tag==1){
                    if(num>=719){
                        return num;
                    }else{
                        return (++num);
                    }
                }else{
                    if(num<=360){
                        return num;
                    }else{
                        return (--num);
                    }
                }
            case '6':
                if(tag==1){
                    if(num>=1079){
                        return num;
                    }else{
                        return (++num);
                    }
                }else{
                    if(num<=720){
                        return num;
                    }else{
                        return (--num);
                    }
                }
                break;
        }   
    }

    //计数器增加
    $(document).on('click','.arrow-up',function(){
        var num=parseInt($(this).closest("dl").find("dt").text());
        var flag=$(this).closest("li").attr("flag");
        $(this).closest("dl").find("dt").text(numSwitch(flag,num,1));
        return false;
    })
    //计数器减少
    $(document).on('click','.arrow-down',function(){
        var num=parseInt($(this).closest("dl").find("dt").text());
        var flag=$(this).closest("li").attr("flag");
        $(this).closest("dl").find("dt").text(numSwitch(flag,num,2));
        return false;
    })
    //获取选中的数据包
    function getActData(){
        var agingSet='';
        var timeObj=$(".timeLine li");
        $.each(timeObj,function(index,item){
            if(index == timeObj.length-1 ){
                agingSet+=$(this).find("dt").text();
            }else{
                agingSet+=$(this).find("dt").text()+',';
            }
            
        });
        return agingSet;
    }
    //获取列表所有数据格式为（31-60）
    function getAllData(){
        var lastValue=0,timeColumn=[];
        var timeObj=$(".timeLine li");
        $.each(timeObj,function(){
            timeColumn.push((lastValue+1)+"-"+$(this).find("dt").text());
            lastValue=parseInt($(this).find("dt").text());  
        });
        return timeColumn;
    }
